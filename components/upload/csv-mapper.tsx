"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface CSVMapperProps {
  headers: string[]
  mapping: Record<string, string>
  onMappingChange: (mapping: Record<string, string>) => void
}

const requiredFields = [
  { key: "description", label: "Description", required: true },
  { key: "billedAmount", label: "Billed Amount", required: true },
  { key: "date", label: "Service Date", required: false },
  { key: "serviceCode", label: "Service Code (CPT)", required: false },
  { key: "quantity", label: "Quantity", required: false },
  { key: "provider", label: "Provider", required: false },
  { key: "insurerAllowed", label: "Insurance Allowed", required: false },
  { key: "patientResponsibility", label: "Patient Responsibility", required: false },
]

export function CSVMapper({ headers, mapping, onMappingChange }: CSVMapperProps) {
  const handleFieldChange = (fieldKey: string, headerValue: string) => {
    const newMapping = { ...mapping }
    if (headerValue === "none") {
      delete newMapping[fieldKey]
    } else {
      newMapping[fieldKey] = headerValue
    }
    onMappingChange(newMapping)
  }

  const mappedCount = Object.keys(mapping).length
  const requiredCount = requiredFields.filter((f) => f.required).length
  const mappedRequiredCount = requiredFields.filter((f) => f.required && mapping[f.key]).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Map CSV Columns</CardTitle>
            <CardDescription>Match your CSV columns to the required fields for analysis</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={mappedRequiredCount === requiredCount ? "default" : "secondary"}>
              {mappedRequiredCount}/{requiredCount} required
            </Badge>
            {mappedRequiredCount === requiredCount && <Check className="h-5 w-5 text-green-600" />}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {requiredFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="flex items-center gap-2">
                {field.label}
                {field.required && <span className="text-xs text-destructive">*</span>}
              </Label>
              <Select
                value={mapping[field.key] || "none"}
                onValueChange={(value) => handleFieldChange(field.key, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not mapped</SelectItem>
                  {headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
