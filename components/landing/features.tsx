import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Brain, PieChart, Download, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: Upload,
    title: "Easy Upload",
    description:
      "Drag and drop your PDF bills or CSV exports. Our system handles any format from any healthcare provider.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced AI compares each line item against fair market prices, Medicare rates, and regional benchmarks.",
  },
  {
    icon: PieChart,
    title: "Detailed Reports",
    description: "Get clear reports showing overpriced items, recommended prices, and total potential savings.",
  },
  {
    icon: Download,
    title: "Export & Share",
    description: "Download detailed CSV reports to share with your insurance company or use for appeals.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your medical data is encrypted end-to-end. We're fully HIPAA compliant and never sell your data.",
  },
  {
    icon: Zap,
    title: "Fast Results",
    description: "Get analysis results in minutes, not days. Our AI processes bills instantly for quick action.",
  },
]

export function Features() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Fight Unfair Billing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful tools designed to help you understand and reduce your medical expenses.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="rounded-2xl border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
