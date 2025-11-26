import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Loader2 } from "lucide-react"
import type { Bill } from "@/lib/types"

interface RecentBillsProps {
  bills: Bill[]
}

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const },
  processing: { label: "Processing", variant: "outline" as const },
  ocr: { label: "OCR Processing", variant: "outline" as const },
  analyzing: { label: "Analyzing", variant: "outline" as const },
  analyzed: { label: "Analyzed", variant: "default" as const },
  error: { label: "Error", variant: "destructive" as const },
}

export function RecentBills({ bills }: RecentBillsProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Bills</CardTitle>
          <CardDescription>Your latest uploaded bills and their analysis status</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild className="rounded-full bg-transparent">
          <Link href="/dashboard/bills">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bills.map((bill) => {
            const status = statusConfig[bill.status]
            return (
              <Link
                key={bill.id}
                href={`/dashboard/bills/${bill.id}`}
                className="block rounded-xl border border-border/50 p-4 transition-all hover:bg-muted/50 hover:shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* Icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {bill.status === "processing" ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  {/* Content - takes remaining space */}
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Provider name and badge on same line */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground truncate max-w-[200px]">{bill.provider}</span>
                      <Badge variant={status.variant} className="shrink-0 rounded-full text-xs">
                        {status.label}
                      </Badge>
                    </div>
                    {/* File info on separate line */}
                    <p className="text-sm text-muted-foreground truncate">
                      {bill.fileName} • {new Date(bill.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Amount - right aligned on desktop, full width on mobile */}
                  <div className="shrink-0 sm:text-right">
                    <p className="font-semibold text-foreground">${bill.totalBilled.toLocaleString()}</p>
                    {bill.status === "analyzed" && bill.totalSavings > 0 && (
                      <p className="text-sm font-medium text-success">Save ${bill.totalSavings.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
