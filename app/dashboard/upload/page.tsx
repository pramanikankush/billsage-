"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileDropzone } from "@/components/upload/file-dropzone"
import { CSVMapper } from "@/components/upload/csv-mapper"
import { UploadProgress } from "@/components/upload/upload-progress"
import { extractCSVHeaders, parseCSV, mapCSVToLineItems, simulatePDFParse } from "@/lib/bill-parser"
import { analyzeBill } from "@/lib/gemini-analyzer"
import { processDocument, validateExtractedData } from "@/lib/document-processor"
import { uploadBillFile, createBill } from "@/lib/temp-storage"
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

import { UpgradeModal } from "@/components/modals/upgrade-modal"

type Step = "upload" | "configure" | "processing" | "complete"
type ProcessingStage = "uploading" | "ocr" | "parsing" | "analyzing" | "complete"

export default function UploadPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState<Step>("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [providerName, setProviderName] = useState("")
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvMapping, setCsvMapping] = useState<Record<string, string>>({})
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("uploading")
  const [progress, setProgress] = useState(0)
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const handleFileSelect = useCallback(async (file: File) => {
    // Check free tier limit
    if (user && user.plan === "free" && (user.billUploadCount || 0) >= 3) {
      setShowUpgradeModal(true)
      return
    }

    setSelectedFile(file)
    setUploadError(null)

    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      const text = await file.text()
      const headers = extractCSVHeaders(text)
      setCsvHeaders(headers)

      // Auto-map common column names
      const autoMapping: Record<string, string> = {}
      headers.forEach((header) => {
        const lower = header.toLowerCase()
        if (lower.includes("description") || lower.includes("service")) {
          autoMapping.description = header
        }
        if (lower.includes("amount") || lower.includes("charge") || lower.includes("billed")) {
          autoMapping.billedAmount = header
        }
        if (lower.includes("date")) {
          autoMapping.date = header
        }
        if (lower.includes("code") || lower.includes("cpt")) {
          autoMapping.serviceCode = header
        }
        if (lower.includes("quantity") || lower.includes("qty")) {
          autoMapping.quantity = header
        }
        if (lower.includes("provider")) {
          autoMapping.provider = header
        }
      })
      setCsvMapping(autoMapping)
    }
  }, [user])

  const handleClearFile = useCallback(() => {
    setSelectedFile(null)
    setCsvHeaders([])
    setCsvMapping({})
    setUploadError(null)
  }, [])

  const canProceed = selectedFile && providerName.trim()
  const isCSV = selectedFile?.type === "text/csv" || selectedFile?.name.endsWith(".csv")
  const csvMappingValid = !isCSV || (csvMapping.description && csvMapping.billedAmount)

  const handleStartAnalysis = async () => {
    if (!selectedFile || !canProceed || !csvMappingValid || !user) return

    setStep("processing")
    setProcessingStage("uploading")
    setProgress(10)
    setUploadError(null)

    try {
      const uploadResult = await uploadBillFile(selectedFile, user.id)

      if (!uploadResult) {
        console.log("File storage skipped (file may be too large), continuing with local processing")
      } else {
        console.log("File uploaded to temporary storage:", uploadResult.path)
      }

      setProgress(25)

      let lineItems
      const fileType = selectedFile.type.toLowerCase()
      const fileName = selectedFile.name.toLowerCase()
      const isImage =
        fileType.includes("image") || fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
      const isPDF = fileType.includes("pdf") || fileName.endsWith(".pdf")

      if (isCSV) {
        setProcessingStage("parsing")
        const text = await selectedFile.text()
        const rows = parseCSV(text)
        lineItems = mapCSVToLineItems(rows, csvMapping)
        setProgress(50)
      } else if (isPDF || isImage) {
        setProcessingStage("ocr")
        setProgress(30)

        try {
          const extractionResult = await processDocument(selectedFile)
          lineItems = extractionResult.lineItems

          const validation = validateExtractedData(lineItems)
          if (!validation.isValid) {
            console.warn("Data validation warnings:", validation.errors)
          }

          setProgress(50)
        } catch (error) {
          console.error("OCR extraction failed:", error)
          setUploadError(
            error instanceof Error
              ? error.message
              : "Failed to extract data from document. Please ensure the file is a valid medical bill.",
          )
          setStep("upload")
          return
        }
      } else {
        lineItems = simulatePDFParse(selectedFile.name)
      }

      setProcessingStage("analyzing")
      setProgress(60)

      const analyzed = await analyzeBill(lineItems)

      for (let i = 60; i <= 90; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setProgress(i)
      }

      setProgress(100)
      setProcessingStage("complete")

      if (user) {
        try {
          const savedBill = await createBill({
            userId: user.id,
            organizationId: user.organizationId,
            fileName: selectedFile.name,
            fileType: isCSV ? "csv" : isPDF ? "pdf" : "image",
            status: "analyzed",
            provider: providerName,
            totalBilled: analyzed.reduce((sum, item) => sum + item.billedAmount, 0),
            totalRecommended: analyzed.reduce((sum, item) => sum + item.recommendedPrice, 0),
            totalSavings: analyzed.reduce((sum, item) => sum + item.savings, 0),
          }, analyzed)

          setAnalysisId(savedBill.id)
        } catch (dbError) {
          console.error("Failed to save bill to database:", dbError)
          setUploadError("Analysis complete, but failed to save results. Please try again.")
          setStep("upload")
          return
        }
      } else {
        console.warn("No user found, skipping DB save")
      }

      setStep("complete")
    } catch (error) {
      console.error("Analysis failed:", error)
      setUploadError(
        error instanceof Error ? error.message : "An unexpected error occurred during processing. Please try again.",
      )
      setStep("upload")
    }
  }

  const handleReset = () => {
    setStep("upload")
    setSelectedFile(null)
    setProviderName("")
    setCsvHeaders([])
    setCsvMapping({})
    setProgress(0)
    setUploadError(null)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to dashboard</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Bill</h1>
          <p className="text-muted-foreground">
            Upload a hospital bill for AI-powered analysis
            {user?.plan === "free" && (
              <span className="ml-2 text-sm text-muted-foreground">
                ({3 - (user.billUploadCount || 0)} free uploads remaining)
              </span>
            )}
          </p>
        </div>
      </div>

      {step === "upload" && (
        <>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Select File</CardTitle>
              <CardDescription>Upload your hospital bill in PDF, CSV, or image format</CardDescription>
            </CardHeader>
            <CardContent>
              <FileDropzone onFileSelect={handleFileSelect} selectedFile={selectedFile} onClear={handleClearFile} />
              {uploadError && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {uploadError}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedFile && (
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Bill Details</CardTitle>
                <CardDescription>Provide additional information about this bill</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Healthcare Provider Name</Label>
                  <Input
                    id="provider"
                    placeholder="e.g., Memorial Hospital, City Medical Center"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {isCSV && csvHeaders.length > 0 && (
            <CSVMapper headers={csvHeaders} mapping={csvMapping} onMappingChange={setCsvMapping} />
          )}

          {isCSV && !csvMappingValid && selectedFile && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Please map the required fields (Description and Billed Amount) to continue.
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" asChild className="rounded-full bg-transparent">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button onClick={handleStartAnalysis} disabled={!canProceed || !csvMappingValid} className="rounded-full">
              Analyze Bill
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {step === "processing" && <UploadProgress stage={processingStage} progress={progress} />}

      {step === "complete" && (
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-success">Analysis Complete!</CardTitle>
            <CardDescription>Your bill has been analyzed and potential savings have been identified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We've identified opportunities to save money on your medical bill. View the detailed report to see which
              items may be overpriced.
            </p>
            <div className="flex gap-3">
              <Button asChild className="rounded-full">
                <Link href={`/dashboard/bills/${analysisId}`}>
                  View Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" onClick={handleReset} className="rounded-full bg-transparent">
                Upload Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
