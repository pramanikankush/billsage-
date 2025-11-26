import { BillingOverview } from "@/components/admin/billing-overview"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Stripe</h1>
        <p className="text-muted-foreground">Manage subscriptions and payment integrations</p>
      </div>

      <BillingOverview />
    </div>
  )
}
