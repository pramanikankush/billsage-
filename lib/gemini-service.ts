import { GoogleGenerativeAI } from "@google/generative-ai"
import type { BillLineItem, OCRMetadata } from "./types"

// Initialize Gemini AI
const getGeminiClient = () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
        throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not configured")
    }
    // Explicitly use v1 API version as requested
    return new GoogleGenerativeAI(apiKey)
}

/**
 * Extract structured bill data from PDF/image using Gemini Vision
 */
export async function extractBillDataFromImage(
    file: File,
): Promise<{ lineItems: Partial<BillLineItem>[]; metadata: OCRMetadata; rawText: string }> {
    const startTime = Date.now()

    try {
        const genAI = getGeminiClient()
        // Using Gemini 2.0 Flash (production) on v1 API
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }, { apiVersion: "v1" })

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer()
        const base64Data = Buffer.from(arrayBuffer).toString("base64")
        const mimeType = file.type || "application/pdf"

        const prompt = `You are an expert medical billing analyst. Analyze this medical bill document and extract ALL line items with complete details.

For each line item, extract:
- Service Code/CPT Code (if available)
- Description of service
- Date of service
- Billed amount (the charge amount)
- Quantity
- Provider name
- Insurance allowed amount (if shown)
- Patient responsibility amount (if shown)

Return the data in this EXACT JSON format:
{
  "provider": "Hospital/Provider Name",
  "billDate": "YYYY-MM-DD",
  "lineItems": [
    {
      "serviceCode": "CPT code or null",
      "description": "Service description",
      "date": "YYYY-MM-DD",
      "billedAmount": 0.00,
      "quantity": 1,
      "provider": "Provider name",
      "insurerAllowed": 0.00 or null,
      "patientResponsibility": 0.00
    }
  ]
}

IMPORTANT:
- Extract ALL line items, not just a sample
- Use null for missing values
- Ensure all amounts are numbers (no $ signs)
- Be thorough and accurate
- If you see multiple pages, extract from all pages`

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType,
                    data: base64Data,
                },
            },
            { text: prompt },
        ])

        const response = await result.response
        const text = response.text()

        // Extract JSON from response (handle markdown code blocks)
        let jsonText = text
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/)
        if (jsonMatch) {
            jsonText = jsonMatch[1]
        }

        const parsed = JSON.parse(jsonText)
        const processingTime = Date.now() - startTime

        // Generate unique IDs for line items
        const lineItems = (parsed.lineItems || []).map((item: any, index: number) => ({
            id: `ocr_${Date.now()}_${index}`,
            serviceCode: item.serviceCode || null,
            cptCode: item.serviceCode || null,
            description: item.description || "Unknown service",
            date: item.date || new Date().toISOString().split("T")[0],
            billedAmount: Number.parseFloat(item.billedAmount) || 0,
            quantity: Number.parseInt(item.quantity) || 1,
            provider: item.provider || parsed.provider || "Unknown Provider",
            insurerAllowed: item.insurerAllowed ? Number.parseFloat(item.insurerAllowed) : null,
            patientResponsibility: item.patientResponsibility
                ? Number.parseFloat(item.patientResponsibility)
                : Number.parseFloat(item.billedAmount) || 0,
        }))

        const metadata: OCRMetadata = {
            confidence: 85, // Gemini doesn't provide confidence, using default high value
            extractedText: text,
            processingTime,
            pageCount: 1, // We'll update this if we add multi-page support
        }

        return {
            lineItems,
            metadata,
            rawText: text,
        }
    } catch (error) {
        console.error("Gemini OCR extraction failed:", error)
        throw new Error(`Failed to extract bill data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
}

/**
 * Analyze line items for overpricing using Gemini AI
 */
export async function analyzeLineItemsWithAI(
    lineItems: Partial<BillLineItem>[],
): Promise<
    Array<{
        isOverpriced: boolean
        recommendedPrice: number
        confidence: number
        reasoning: string
        savings: number
    }>
> {
    try {
        const genAI = getGeminiClient()
        // Using Gemini 2.0 Flash (production) on v1 API
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }, { apiVersion: "v1" })

        const prompt = `You are an expert medical billing auditor with deep knowledge of Medicare rates, fair market pricing, and healthcare billing practices.

Analyze these medical bill line items for potential overcharges:

${JSON.stringify(lineItems, null, 2)}

For EACH line item, determine:
1. Is it overpriced compared to Medicare rates and fair market value?
2. What should be a fair/recommended price?
3. Your confidence level (0-100)
4. Detailed reasoning explaining your analysis

Consider:
- Medicare reimbursement rates for CPT codes
- Typical commercial insurance allowed amounts (usually 150-300% of Medicare)
- Geographic variations
- Facility vs non-facility pricing
- Whether charges exceed reasonable market rates

Return EXACTLY this JSON format with one analysis per line item:
{
  "analyses": [
    {
      "isOverpriced": true/false,
      "recommendedPrice": 0.00,
      "confidence": 85,
      "reasoning": "Detailed explanation...",
      "savings": 0.00
    }
  ]
}

Be thorough and accurate. Flag items that are significantly above fair market rates.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Extract JSON from response
        let jsonText = text
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/)
        if (jsonMatch) {
            jsonText = jsonMatch[1]
        }

        const parsed = JSON.parse(jsonText)
        return parsed.analyses || []
    } catch (error) {
        console.error("Gemini analysis failed:", error)
        // Return default analysis if AI fails
        return lineItems.map((item) => ({
            isOverpriced: false,
            recommendedPrice: item.billedAmount || 0,
            confidence: 50,
            reasoning: "AI analysis unavailable. Using billed amount as recommended price.",
            savings: 0,
        }))
    }
}

/**
 * Extract text from PDF using Gemini (alternative to OCR for text-based PDFs)
 */
export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        const genAI = getGeminiClient()
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }, { apiVersion: "v1" })

        const arrayBuffer = await file.arrayBuffer()
        const base64Data = Buffer.from(arrayBuffer).toString("base64")

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: "application/pdf",
                    data: base64Data,
                },
            },
            { text: "Extract all text from this document. Preserve the structure and formatting as much as possible." },
        ])

        const response = await result.response
        return response.text()
    } catch (error) {
        console.error("PDF text extraction failed:", error)
        throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
}
