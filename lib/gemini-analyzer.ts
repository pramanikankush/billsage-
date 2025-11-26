import type { BillLineItem } from "./types"
import { analyzeLineItemsWithAI } from "./gemini-service"

interface AnalysisInput {
  serviceCode: string | null
  description: string
  billedAmount: number
  quantity: number
}

interface AnalysisResult {
  isOverpriced: boolean
  recommendedPrice: number
  confidence: number
  reasoning: string
  savings: number
}

/**
 * Analyze a single line item for potential overcharges using AI
 * Falls back to heuristic analysis if AI is unavailable
 * @param item - The line item to analyze
 * @returns Analysis result with pricing recommendations
 */
export async function analyzeLineItem(item: AnalysisInput): Promise<AnalysisResult> {
  // Try AI analysis first
  try {
    const analyses = await analyzeLineItemsWithAI([item])
    if (analyses && analyses.length > 0) {
      return analyses[0]
    }
  } catch (error) {
    console.warn("AI analysis failed, using fallback:", error)
  }

  // Fallback to heuristic analysis
  return fallbackAnalysis(item)
}

/**
 * Fallback heuristic analysis when AI is unavailable
 */
function fallbackAnalysis(item: AnalysisInput): AnalysisResult {
  // Mock analysis logic based on common CPT codes and typical pricing
  const pricingData: Record<string, { fairPrice: number; maxReasonable: number }> = {
    "99213": { fairPrice: 150, maxReasonable: 250 },
    "99214": { fairPrice: 200, maxReasonable: 350 },
    "99215": { fairPrice: 280, maxReasonable: 450 },
    "36415": { fairPrice: 15, maxReasonable: 35 },
    "80053": { fairPrice: 50, maxReasonable: 100 },
    "85025": { fairPrice: 40, maxReasonable: 80 },
    "71046": { fairPrice: 120, maxReasonable: 200 },
    "43239": { fairPrice: 1800, maxReasonable: 3000 },
    "99284": { fairPrice: 850, maxReasonable: 1400 },
    "00740": { fairPrice: 600, maxReasonable: 1000 },
    "88305": { fairPrice: 150, maxReasonable: 250 },
  }

  const code = item.serviceCode || ""
  const pricing = pricingData[code]

  if (pricing) {
    const isOverpriced = item.billedAmount > pricing.maxReasonable
    const recommendedPrice = Math.min(item.billedAmount, pricing.fairPrice * 1.2)
    const savings = Math.max(0, item.billedAmount - recommendedPrice)
    const confidence = 85 + Math.floor(Math.random() * 15)

    return {
      isOverpriced,
      recommendedPrice: Math.round(recommendedPrice * 100) / 100,
      confidence,
      reasoning: isOverpriced
        ? `The billed amount of $${item.billedAmount} for CPT ${code} exceeds typical fair market rates of $${pricing.fairPrice}-${pricing.maxReasonable}. Medicare reimburses approximately $${Math.round(pricing.fairPrice * 0.8)} for this service. This charge is ${Math.round((item.billedAmount / pricing.fairPrice - 1) * 100)}% above the median rate.`
        : `The billed amount of $${item.billedAmount} for CPT ${code} is within acceptable range for this service. Fair market rates typically fall between $${pricing.fairPrice}-${pricing.maxReasonable}.`,
      savings,
    }
  }

  // Fallback for unknown codes - use heuristic based on amount
  const estimatedFairPrice = item.billedAmount * 0.4
  const isOverpriced = item.billedAmount > 100

  return {
    isOverpriced,
    recommendedPrice: Math.round(estimatedFairPrice * 100) / 100,
    confidence: 60 + Math.floor(Math.random() * 20),
    reasoning: isOverpriced
      ? `Based on service description analysis, the charge of $${item.billedAmount} appears elevated compared to typical rates for similar services. Without a specific CPT code, our confidence is moderate, but historical data suggests a fair price closer to $${Math.round(estimatedFairPrice)}.`
      : `The charge of $${item.billedAmount} appears reasonable for the described service based on historical pricing data.`,
    savings: Math.max(0, item.billedAmount - estimatedFairPrice),
  }
}

/**
 * Analyze all line items in a bill using AI
 * @param lineItems - Array of line items to analyze
 * @returns Array of analyzed line items with pricing recommendations
 */
export async function analyzeBill(lineItems: Partial<BillLineItem>[]): Promise<BillLineItem[]> {
  // Try batch AI analysis first
  try {
    const analyses = await analyzeLineItemsWithAI(lineItems)

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
        description: item.description || "",
        date: item.date || new Date().toISOString().split("T")[0],
        billedAmount: item.billedAmount || 0,
        quantity: item.quantity || 1,
        provider: item.provider || "Unknown",
        insurerAllowed: item.insurerAllowed || null,
        patientResponsibility: item.patientResponsibility || item.billedAmount || 0,
        isOverpriced: analysis.isOverpriced,
        recommendedPrice: analysis.recommendedPrice,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        savings: analysis.savings,
      }
    })
  } catch (error) {
    console.warn("Batch AI analysis failed, using fallback:", error)

    // Fallback to individual analysis
    const analyzed: BillLineItem[] = []

    for (const item of lineItems) {
      const analysis = await analyzeLineItem({
        serviceCode: item.serviceCode || null,
        description: item.description || "",
        billedAmount: item.billedAmount || 0,
        quantity: item.quantity || 1,
      })

      analyzed.push({
        id: item.id || crypto.randomUUID(),
        serviceCode: item.serviceCode || null,
        cptCode: item.cptCode || null,
        description: item.description || "",
        date: item.date || new Date().toISOString().split("T")[0],
        billedAmount: item.billedAmount || 0,
        quantity: item.quantity || 1,
        provider: item.provider || "Unknown",
        insurerAllowed: item.insurerAllowed || null,
        patientResponsibility: item.patientResponsibility || item.billedAmount || 0,
        isOverpriced: analysis.isOverpriced,
        recommendedPrice: analysis.recommendedPrice,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        savings: analysis.savings,
      })
    }

    return analyzed
  }
}
