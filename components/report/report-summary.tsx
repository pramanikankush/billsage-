import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, Lightbulb, FileDown } from "lucide-react"
import type { Bill } from "@/lib/types"

interface ReportSummaryProps {
  bill: Bill
}

export function ReportSummary({ bill }: ReportSummaryProps) {
  const overpricedItems = bill.lineItems.filter((item) => item.isOverpriced)
  const fairItems = bill.lineItems.filter((item) => !item.isOverpriced)
  const avgConfidence =
    bill.lineItems.length > 0
      ? Math.round(bill.lineItems.reduce((sum, item) => sum + item.confidence, 0) / bill.lineItems.length)
      : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
          <CardDescription>Overview of your bill analysis results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overpricedItems.length}</p>
                <p className="text-sm text-muted-foreground">Overpriced Items</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{fairItems.length}</p>
                <p className="text-sm text-muted-foreground">Fair Priced Items</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-bold text-primary">{avgConfidence}%</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{bill.lineItems.length}</p>
                <p className="text-sm text-muted-foreground">Total Line Items</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {overpricedItems.length > 0 ? (
            <>
              <p className="text-sm text-foreground">
                We found <strong>{overpricedItems.length} items</strong> that appear to be overpriced, with potential
                savings of <strong>${bill.totalSavings.toLocaleString()}</strong>.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Here's what you can do:</p>
                <ol className="list-inside list-decimal space-y-1 pl-2">
                  <li>Request an itemized bill from the provider if you haven't already</li>
                  <li>Contact the billing department to dispute overpriced charges</li>
                  <li>Ask for a payment plan or financial assistance if needed</li>
                  <li>File an appeal with your insurance company for denied coverage</li>
                </ol>
              </div>
            </>
          ) : (
            <p className="text-sm text-foreground">
              Great news! All items on this bill appear to be fairly priced based on our analysis.
            </p>
          )}

          <div className="pt-2">
            <Button size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Download Dispute Letter Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
