// Core types for BillSage

export interface User {
  id: string
  email: string
  name: string
  organizationId: string
  role: "user"
  createdAt: string
  billUploadCount: number
  plan: "free" | "pro" | "enterprise"
}

export interface Organization {
  id: string
  name: string
  plan: "free" | "pro" | "enterprise"
  createdAt: string
  billCount: number
  totalSavings: number
}

export interface BillLineItem {
  id: string
  billId: string
  serviceCode: string | null
  cptCode: string | null
  description: string
  date: string
  billedAmount: number
  quantity: number
  provider: string
  insurerAllowed: number | null
  patientResponsibility: number
  isOverpriced: boolean
  recommendedPrice: number
  confidence: number
  reasoning: string
  savings: number
}

export interface OCRMetadata {
  confidence: number
  extractedText?: string
  processingTime: number
  pageCount: number
}

export interface Bill {
  id: string
  userId: string
  organizationId: string
  fileName: string
  fileType: "pdf" | "csv" | "image"
  filePath?: string
  uploadedAt: string
  status: "pending" | "processing" | "ocr" | "analyzing" | "analyzed" | "error"
  provider: string
  totalBilled: number
  totalRecommended: number
  totalSavings: number
  lineItems: BillLineItem[]
  rawText?: string
  parsedJson?: string
  geminiResponse?: string
  ocrMetadata?: OCRMetadata
  errorMessage?: string
}

export interface AnalysisResult {
  billId: string
  analyzedAt: string
  overchargedItems: number
  totalItems: number
  estimatedSavings: number
  confidenceScore: number
  summary: string
}

export interface DashboardStats {
  totalBills: number
  totalAnalyzed: number
  totalSavings: number
  averageSavingsPerBill: number
  recentBills: Bill[]
  monthlySavings: { month: string; savings: number }[]
  savingsRate: number
  previousMonthSavings: number
  savingsRateTrend: number
}
