import { PricingManager } from "@/components/admin/pricing-manager"

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pricing Reference Data</h1>
        <p className="text-muted-foreground">Manage CPT code pricing benchmarks and import pricing sources</p>
      </div>

      <PricingManager />
    </div>
  )
}
