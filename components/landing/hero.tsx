import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, TrendingUp, FileSearch } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-background to-background pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-8 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100">
            Trusted by 2,000+ families
          </Badge>

          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Stop Overpaying for{" "}
            <span className="block text-blue-500">Medical Bills</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Upload your hospital bills and let AI analyze every line item. BillSage identifies overcharges, suggests
            fair prices, and helps you save thousands on healthcare costs.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="h-12 w-full rounded-full bg-blue-600 px-8 text-base hover:bg-blue-700 sm:w-auto">
              <Link href="/signup">
                Start Saving Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-12 w-full rounded-full border-2 px-8 text-base sm:w-auto">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background px-5 py-2.5 text-sm font-medium shadow-sm">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-foreground">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background px-5 py-2.5 text-sm font-medium shadow-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-foreground">$2.4M+ Saved</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background px-5 py-2.5 text-sm font-medium shadow-sm">
              <FileSearch className="h-4 w-4 text-blue-600" />
              <span className="text-foreground">50K+ Bills Analyzed</span>
            </div>
          </div>
        </div>

        <div className="mt-20 -mb-32 sm:mt-24 sm:-mb-48 lg:mt-32 lg:-mb-64">
          <div className="relative mx-auto max-w-5xl rounded-3xl border border-border/50 bg-background p-2 shadow-2xl shadow-blue-500/10 lg:rounded-[2.5rem] lg:p-4">
            <div className="aspect-video overflow-hidden rounded-2xl bg-muted lg:rounded-[2rem]">
              <video
                src="/hero-video.mp4"
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
