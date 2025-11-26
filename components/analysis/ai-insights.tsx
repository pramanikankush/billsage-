"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, Brain, DollarSign } from "lucide-react"
import type { BillLineItem } from "@/lib/types"

interface AIInsightsProps {
    lineItems: BillLineItem[]
    totalBilled: number
    totalRecommended: number
    totalSavings: number
}

export function AIInsights({ lineItems, totalBilled, totalRecommended, totalSavings }: AIInsightsProps) {
    const overpricedItems = lineItems.filter((item) => item.isOverpriced)
    const averageConfidence =
        lineItems.reduce((sum, item) => sum + item.confidence, 0) / lineItems.length || 0
    const savingsPercentage = totalBilled > 0 ? (totalSavings / totalBilled) * 100 : 0

    return (
        <div className="space-y-6">
            {/* Overall Summary */}
            <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        <CardTitle>AI Analysis Summary</CardTitle>
                    </div>
                    <CardDescription>Powered by Google Gemini AI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Potential Savings</p>
                            <p className="text-2xl font-bold text-primary">
                                ${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-muted-foreground">{savingsPercentage.toFixed(1)}% of total bill</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Overpriced Items</p>
                            <p className="text-2xl font-bold text-destructive">
                                {overpricedItems.length} / {lineItems.length}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {lineItems.length > 0 ? ((overpricedItems.length / lineItems.length) * 100).toFixed(0) : 0}% of
                                line items
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">AI Confidence</p>
                            <p className="text-2xl font-bold text-foreground">{averageConfidence.toFixed(0)}%</p>
                            <p className="text-xs text-muted-foreground">Average across all items</p>
                        </div>
                    </div>

                    {totalSavings > 0 && (
                        <div className="flex items-center gap-2 rounded-lg bg-background/50 p-3 text-sm">
                            <TrendingDown className="h-4 w-4 text-primary" />
                            <p className="text-muted-foreground">
                                Our AI identified{" "}
                                <span className="font-semibold text-foreground">
                                    ${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>{" "}
                                in potential savings by comparing against Medicare rates and fair market pricing.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Top Overpriced Items */}
            {overpricedItems.length > 0 && (
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <CardTitle>Top Overpriced Items</CardTitle>
                        </div>
                        <CardDescription>Items flagged by AI as significantly above fair market rates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {overpricedItems
                                .sort((a, b) => b.savings - a.savings)
                                .slice(0, 5)
                                .map((item) => (
                                    <div key={item.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="font-medium text-foreground">{item.description}</p>
                                                    {item.serviceCode && (
                                                        <p className="text-sm text-muted-foreground">CPT Code: {item.serviceCode}</p>
                                                    )}
                                                </div>
                                                <Badge variant="destructive" className="shrink-0">
                                                    ${item.savings.toFixed(2)} overcharge
                                                </Badge>
                                            </div>

                                            <div className="grid gap-2 text-sm md:grid-cols-3">
                                                <div>
                                                    <p className="text-muted-foreground">Billed Amount</p>
                                                    <p className="font-semibold text-destructive">${item.billedAmount.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Fair Price</p>
                                                    <p className="font-semibold text-primary">${item.recommendedPrice.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">AI Confidence</p>
                                                    <p className="font-semibold text-foreground">{item.confidence}%</p>
                                                </div>
                                            </div>

                                            <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                                                <p className="font-medium text-foreground">AI Analysis:</p>
                                                <p className="mt-1">{item.reasoning}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Bill Health Score */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <CardTitle>Bill Health Score</CardTitle>
                    </div>
                    <CardDescription>Overall assessment of billing accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className="h-4 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className={`h-full transition-all ${savingsPercentage < 10
                                            ? "bg-green-500"
                                            : savingsPercentage < 25
                                                ? "bg-yellow-500"
                                                : "bg-destructive"
                                            }`}
                                        style={{ width: `${Math.min(100, 100 - savingsPercentage)}%` }}
                                    />
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-foreground">
                                    {Math.max(0, Math.min(100, 100 - savingsPercentage)).toFixed(0)}%
                                </p>
                                <p className="text-xs text-muted-foreground">Health Score</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            {savingsPercentage < 10 && (
                                <p className="text-muted-foreground">
                                    ✓ <span className="font-medium text-green-600">Excellent</span> - This bill appears to be fairly
                                    priced with minimal overcharges.
                                </p>
                            )}
                            {savingsPercentage >= 10 && savingsPercentage < 25 && (
                                <p className="text-muted-foreground">
                                    ⚠ <span className="font-medium text-yellow-600">Fair</span> - Some items are overpriced. Consider
                                    negotiating with your provider.
                                </p>
                            )}
                            {savingsPercentage >= 25 && (
                                <p className="text-muted-foreground">
                                    ⚠ <span className="font-medium text-destructive">Poor</span> - Significant overcharges detected.
                                    Strongly recommend disputing these charges.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
