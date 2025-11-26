import Link from "next/link"
import { ArrowLeft, Sparkles, Shield, TrendingDown, FileSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeaturesPage() {
    const features = [
        {
            icon: FileSearch,
            title: "AI-Powered Analysis",
            description: "Our advanced AI scans every line item on your medical bill to identify overcharges and billing errors."
        },
        {
            icon: TrendingDown,
            title: "Instant Savings Identification",
            description: "Get immediate insights into potential savings with detailed breakdowns of each charge."
        },
        {
            icon: Shield,
            title: "HIPAA Compliant",
            description: "Your medical data is protected with bank-level encryption and HIPAA-compliant security measures."
        },
        {
            icon: Sparkles,
            title: "Transparent Pricing Data",
            description: "Access fair market pricing data to understand what you should actually be paying."
        }
    ]

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Button variant="ghost" asChild className="rounded-full">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Features
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Powerful tools to help you save money on medical bills
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                    {features.map((feature) => (
                        <Card key={feature.title} className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Button asChild size="lg" className="rounded-full">
                        <Link href="/signup">Get Started Free</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
