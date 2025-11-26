"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileDropzoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onClear: () => void
}

export function FileDropzone({ onFileSelect, selectedFile, onClear }: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null)

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === "file-too-large") {
          setError("File is too large. Maximum size is 10MB.")
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Invalid file type. Please upload a PDF or CSV file.")
        } else {
          setError("Unable to upload this file. Please try again.")
        }
        return
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/csv": [".csv"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  })

  if (selectedFile) {
    return (
      <div className="rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB •{" "}
                {selectedFile.type === "application/pdf"
                  ? "PDF"
                  : selectedFile.type === "text/csv"
                    ? "CSV"
                    : selectedFile.type.startsWith("image/")
                      ? "Image"
                      : "File"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClear}>
            <X className="h-5 w-5" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
          error && "border-destructive bg-destructive/5",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full",
              isDragActive ? "bg-primary/10" : "bg-muted",
            )}
          >
            <Upload className={cn("h-8 w-8", isDragActive ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">
              {isDragActive ? "Drop your file here" : "Drop your bill here, or click to browse"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Supports PDF, CSV, and image files (PNG, JPG) up to 10MB</p>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}
