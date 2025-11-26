"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Loader2, FileText, Brain, FileSearch, ScanText } from "lucide-react"

interface UploadProgressProps {
  stage: "uploading" | "ocr" | "parsing" | "analyzing" | "complete"
  progress: number
}

const stages = [
  { key: "uploading", label: "Uploading file", icon: FileText },
  { key: "ocr", label: "Scanning document with AI", icon: ScanText },
  { key: "parsing", label: "Extracting line items", icon: FileSearch },
  { key: "analyzing", label: "AI analyzing charges", icon: Brain },
  { key: "complete", label: "Analysis complete", icon: CheckCircle2 },
]

export function UploadProgress({ stage, progress }: UploadProgressProps) {
  const currentIndex = stages.findIndex((s) => s.key === stage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Your Bill</CardTitle>
        <CardDescription>Please wait while we analyze your medical bill</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progress} className="h-2" />

        <div className="space-y-4">
          {stages.map((s, index) => {
            const isComplete = index < currentIndex || (index === currentIndex && stage === "complete")
            const isCurrent = index === currentIndex && stage !== "complete"
            const Icon = s.icon

            return (
              <div
                key={s.key}
                className={`flex items-center gap-3 ${isComplete ? "text-foreground" : isCurrent ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${isComplete ? "bg-primary/10" : isCurrent ? "bg-primary/10" : "bg-muted"
                    }`}
                >
                  {isCurrent ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`font-medium ${isCurrent ? "text-primary" : ""}`}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
