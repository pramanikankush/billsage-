import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, FileText, DollarSign, TrendingUp, Activity } from "lucide-react"

interface AdminStatsProps {
  stats: {
    totalOrganizations: number
    totalUsers: number
    totalBills: number
    totalRevenue: number
    monthlyGrowth: number
    activeToday: number
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    {
      title: "Total Organizations",
      value: stats.totalOrganizations.toString(),
      icon: Building2,
      description: "+3 this month",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      description: "+12 this month",
    },
    {
      title: "Bills Analyzed",
      value: stats.totalBills.toLocaleString(),
      icon: FileText,
      description: "All time",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: `+${stats.monthlyGrowth}% vs last month`,
    },
    {
      title: "Active Today",
      value: stats.activeToday.toString(),
      icon: Activity,
      description: "Users online",
    },
    {
      title: "Conversion Rate",
      value: "23%",
      icon: TrendingUp,
      description: "Free to paid",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
