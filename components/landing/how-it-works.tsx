import { Badge } from "@/components/ui/badge"

const steps = [
  {
    number: "01",
    title: "Upload Your Bill",
    description:
      "Simply drag and drop your hospital bill PDF or import a CSV. We support bills from any healthcare provider in the United States.",
  },
  {
    number: "02",
    title: "AI Analyzes Every Line",
    description:
      "Our AI extracts each charge, identifies the service codes, and compares prices against Medicare rates, regional averages, and fair market data.",
  },
  {
    number: "03",
    title: "Review Your Report",
    description:
      "See which items are overpriced with clear explanations. Each flagged item shows the fair price range and your potential savings.",
  },
  {
    number: "04",
    title: "Take Action",
    description:
      "Use your report to negotiate with providers, file insurance appeals, or request itemized billing adjustments.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/40 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 rounded-full px-4 py-1.5">
            Simple Process
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How BillSage Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">From upload to savings in four simple steps.</p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-0.5 w-full -translate-x-1/2 bg-border lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-card text-2xl font-bold text-primary shadow-sm">
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
