import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, CreditCard } from "lucide-react"

export function BillingOverview() {
  const recentTransactions = [
    { id: 1, org: "Smith Healthcare LLC", amount: 49, plan: "pro", date: "2024-11-20" },
    { id: 2, org: "MedCare Consulting", amount: 49, plan: "pro", date: "2024-11-19" },
    { id: 3, org: "Regional Hospital Group", amount: 199, plan: "enterprise", date: "2024-11-18" },
    { id: 4, org: "Williams Family", amount: 0, plan: "free", date: "2024-11-17" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Recurring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$4,850</div>
            <p className="text-sm text-green-600">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">127</div>
            <p className="text-sm text-muted-foreground">89 Pro, 38 Enterprise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.3%</div>
            <p className="text-sm text-green-600">-0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Stripe Integration</CardTitle>
            <CardDescription>Manage payments and subscriptions</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Stripe Dashboard
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#635BFF]">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Stripe Connected</p>
                <p className="text-sm text-muted-foreground">Test mode • Last sync: 2 minutes ago</p>
              </div>
              <Badge className="ml-auto" variant="outline">
                Test Mode
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest subscription payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{tx.org}</p>
                  <p className="text-sm text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{tx.plan}</Badge>
                  <span className="font-medium">{tx.amount > 0 ? `$${tx.amount}` : "Free"}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
