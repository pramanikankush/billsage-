import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, Share2, FileText } from "lucide-react"
import type { Bill } from "@/lib/types"

interface ReportHeaderProps {
  bill: Bill
}

export function ReportHeader({ bill }: ReportHeaderProps) {
  const savingsPercentage = bill.totalBilled > 0 ? Math.round((bill.totalSavings / bill.totalBilled) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/bills">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to bills</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{bill.provider}</h1>
              <Badge variant="default">Analyzed</Badge>
            </div>
            <p className="text-muted-foreground">
              {bill.fileName} • Uploaded {new Date(bill.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Billed</p>
                <p className="text-2xl font-bold">${bill.totalBilled.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg font-bold text-primary">$</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fair Price</p>
                <p className="text-2xl font-bold">${bill.totalRecommended.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <span className="text-lg font-bold text-green-600">%</span>
              </div>
              <div>
                <p className="text-sm text-green-700 dark:text-green-400">Potential Savings</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  ${bill.totalSavings.toLocaleString()}
                  <span className="ml-2 text-base font-normal">({savingsPercentage}%)</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
