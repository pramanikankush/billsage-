import type { BillLineItem } from "./types"

interface ParsedCSVRow {
  [key: string]: string
}

// Parse CSV text into structured data
export function parseCSV(csvText: string): ParsedCSVRow[] {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  const rows: ParsedCSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length === headers.length) {
      const row: ParsedCSVRow = {}
      headers.forEach((header, index) => {
        row[header] = values[index]
      })
      rows.push(row)
    }
  }

  return rows
}

// Handle CSV line parsing with quoted values
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      values.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  values.push(current.trim())
  return values
}

// Extract headers from CSV
export function extractCSVHeaders(csvText: string): string[] {
  const firstLine = csvText.split("\n")[0]
  return firstLine.split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
}

// Convert mapped CSV data to line items
export function mapCSVToLineItems(rows: ParsedCSVRow[], mapping: Record<string, string>): Partial<BillLineItem>[] {
  return rows.map((row, index) => ({
    id: `item_${index + 1}`,
    description: row[mapping.description] || "Unknown service",
    billedAmount: Number.parseFloat(row[mapping.billedAmount]?.replace(/[$,]/g, "")) || 0,
    date: row[mapping.date] || new Date().toISOString().split("T")[0],
    serviceCode: row[mapping.serviceCode] || null,
    cptCode: row[mapping.serviceCode] || null,
    quantity: Number.parseInt(row[mapping.quantity]) || 1,
    provider: row[mapping.provider] || "Unknown Provider",
    insurerAllowed: row[mapping.insurerAllowed]
      ? Number.parseFloat(row[mapping.insurerAllowed].replace(/[$,]/g, ""))
      : null,
    patientResponsibility: row[mapping.patientResponsibility]
      ? Number.parseFloat(row[mapping.patientResponsibility].replace(/[$,]/g, ""))
      : Number.parseFloat(row[mapping.billedAmount]?.replace(/[$,]/g, "")) || 0,
  }))
}

// Simulate PDF parsing (in production, this would use OCR)
// This is kept for backward compatibility but should use processDocument from document-processor.ts
export function simulatePDFParse(fileName: string): Partial<BillLineItem>[] {
  console.warn("Using simulated PDF parsing. For real OCR, use processDocument from document-processor.ts")
  // Return sample data for demo purposes
  return [
    {
      id: "pdf_1",
      serviceCode: "99214",
      cptCode: "99214",
      description: "Office visit, established patient, moderate-high complexity",
      date: new Date().toISOString().split("T")[0],
      billedAmount: 385.0,
      quantity: 1,
      provider: "General Hospital",
      insurerAllowed: 145.0,
      patientResponsibility: 385.0,
    },
    {
      id: "pdf_2",
      serviceCode: "36415",
      cptCode: "36415",
      description: "Routine venipuncture for collection of specimen",
      date: new Date().toISOString().split("T")[0],
      billedAmount: 95.0,
      quantity: 1,
      provider: "General Hospital",
      insurerAllowed: 12.0,
      patientResponsibility: 95.0,
    },
    {
      id: "pdf_3",
      serviceCode: "85025",
      cptCode: "85025",
      description: "Complete blood count with differential",
      date: new Date().toISOString().split("T")[0],
      billedAmount: 175.0,
      quantity: 1,
      provider: "General Hospital",
      insurerAllowed: 35.0,
      patientResponsibility: 175.0,
    },
  ]
}
