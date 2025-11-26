import type { BillLineItem, OCRMetadata } from "./types"
import { extractBillDataFromImage, analyzeLineItemsWithAI } from "./gemini-service"

/**
 * Process a document (PDF or image) and extract bill data using AI
 */
export async function processDocument(
    file: File,
): Promise<{ lineItems: Partial<BillLineItem>[]; metadata: OCRMetadata; rawText: string }> {
    const fileType = file.type.toLowerCase()
    const fileName = file.name.toLowerCase()

    // Check if it's an image or PDF
    const isImage =
        fileType.includes("image") || fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
    const isPDF = fileType.includes("pdf") || fileName.endsWith(".pdf")

    if (!isImage && !isPDF) {
        throw new Error("Unsupported file type. Please upload a PDF or image file.")
    }

    // Use Gemini Vision API for both PDFs and images
    return await extractBillDataFromImage(file)
}

/**
 * Analyze extracted line items for overpricing
 */
export async function analyzeDocument(lineItems: Partial<BillLineItem>[]): Promise<BillLineItem[]> {
    // Get AI analysis for all items
    const analyses = await analyzeLineItemsWithAI(lineItems)

    // Combine line items with analysis results
    return lineItems.map((item, index) => {
        const analysis = analyses[index] || {
            isOverpriced: false,
            recommendedPrice: item.billedAmount || 0,
            confidence: 50,
            reasoning: "Analysis not available",
            savings: 0,
        }

        return {
            id: item.id || crypto.randomUUID(),
            serviceCode: item.serviceCode || null,
            cptCode: item.cptCode || null,
            description: item.description || "Unknown service",
            date: item.date || new Date().toISOString().split("T")[0],
            billedAmount: item.billedAmount || 0,
            quantity: item.quantity || 1,
            provider: item.provider || "Unknown Provider",
            insurerAllowed: item.insurerAllowed || null,
            patientResponsibility: item.patientResponsibility || item.billedAmount || 0,
            isOverpriced: analysis.isOverpriced,
            recommendedPrice: analysis.recommendedPrice,
            confidence: analysis.confidence,
            reasoning: analysis.reasoning,
            savings: analysis.savings,
        }
    })
}

/**
 * Validate extracted data quality
 */
export function validateExtractedData(lineItems: Partial<BillLineItem>[]): {
    isValid: boolean
    errors: string[]
} {
    const errors: string[] = []

    if (!lineItems || lineItems.length === 0) {
        errors.push("No line items extracted from document")
    }

    lineItems.forEach((item, index) => {
        if (!item.description || item.description.trim() === "") {
            errors.push(`Line item ${index + 1}: Missing description`)
        }
        if (item.billedAmount === undefined || item.billedAmount === null || item.billedAmount < 0) {
            errors.push(`Line item ${index + 1}: Invalid billed amount`)
        }
    })

    return {
        isValid: errors.length === 0,
        errors,
    }
}
