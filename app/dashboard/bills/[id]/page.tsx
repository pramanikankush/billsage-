"use client"

import { useEffect, useState, use } from "react"
import { notFound } from "next/navigation"
import { ReportHeader } from "@/components/report/report-header"
import { ReportSummary } from "@/components/report/report-summary"
import { LineItemCard } from "@/components/report/line-item-card"
import { AIInsights } from "@/components/analysis/ai-insights"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { mockBills } from "@/lib/mock-data"
import * as tempStorage from "@/lib/temp-storage"
import type { Bill } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function BillReportPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const [bill, setBill] = useState<Bill | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBill() {
      try {
        // Try to get from DB first
        const billData = await tempStorage.getBill(resolvedParams.id)
        if (billData) {
          setBill(billData)
          setLoading(false)
          return
        }

        // Fall back to mock data
        const mockBill = mockBills.find((b) => b.id === resolvedParams.id)
        if (mockBill) {
          setBill(mockBill)
        }
      } catch (error) {
        console.error("Failed to load bill:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBill()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!bill) {
    notFound()
  }

  const overpricedItems = bill.lineItems.filter((item) => item.isOverpriced)
  const fairItems = bill.lineItems.filter((item) => !item.isOverpriced)

  return (
    <div className="space-y-6">
      <ReportHeader bill={bill} />

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="all">All Items ({bill.lineItems.length})</TabsTrigger>
          <TabsTrigger value="overpriced" className="text-amber-600">
            Overpriced ({overpricedItems.length})
          </TabsTrigger>
          <TabsTrigger value="fair" className="text-green-600">
            Fair Price ({fairItems.length})
          </TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <AIInsights
            lineItems={bill.lineItems}
            totalBilled={bill.totalBilled}
            totalRecommended={bill.totalRecommended}
            totalSavings={bill.totalSavings}
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {bill.lineItems.map((item, index) => (
            <LineItemCard key={item.id} item={item} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="overpriced" className="space-y-4">
          {overpricedItems.length > 0 ? (
            overpricedItems.map((item, index) => <LineItemCard key={item.id} item={item} index={index} />)
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No overpriced items found in this bill.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="fair" className="space-y-4">
          {fairItems.length > 0 ? (
            fairItems.map((item, index) => <LineItemCard key={item.id} item={item} index={index} />)
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No fairly priced items found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="summary">
          <ReportSummary bill={bill} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
