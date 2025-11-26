import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, FileText, DollarSign, Target } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  // Calculate trends (mock logic for now if no previous data, or use previousMonthSavings)
  const savingsTrend = stats.previousMonthSavings > 0
    ? ((stats.totalSavings - stats.previousMonthSavings) / stats.previousMonthSavings) * 100
    : 0

  const cards = [
    {
      title: "Total Savings Found",
      value: `$${stats.totalSavings.toLocaleString()}`,
      description: "Across all analyzed bills",
      icon: DollarSign,
      trend: savingsTrend !== 0 ? `${savingsTrend > 0 ? "+" : ""}${savingsTrend.toFixed(1)}%` : undefined,
      trendUp: savingsTrend >= 0,
    },
    {
      title: "Bills Analyzed",
      value: stats.totalAnalyzed.toString(),
      description: `${stats.totalBills} total uploaded`,
      icon: FileText,
    },
    {
      title: "Avg. Savings Per Bill",
      value: `$${stats.averageSavingsPerBill.toFixed(0)}`,
      description: "Per analyzed bill",
      icon: Target,
    },
    {
      title: "Savings Rate",
      value: `${stats.savingsRate.toFixed(1)}%`,
      description: "Average discount identified",
      icon: TrendingUp,
      trend: stats.savingsRateTrend !== 0 ? `${stats.savingsRateTrend > 0 ? "+" : ""}${stats.savingsRateTrend.toFixed(1)}%` : undefined,
      trendUp: stats.savingsRateTrend >= 0,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <card.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">{card.description}</p>
              {card.trend && (
                <Badge
                  variant="secondary"
                  className={`rounded-full text-xs ${card.trendUp ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
                >
                  {card.trend}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
