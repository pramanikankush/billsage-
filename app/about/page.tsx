import Link from "next/link"
import { ArrowLeft, Target, Users, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Button variant="ghost" asChild className="rounded-full">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        About BillSage
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        We're on a mission to make healthcare costs transparent and fair for everyone.
                    </p>
                </div>

                <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground">
                        BillSage was founded with a simple belief: families shouldn't have to struggle with confusing and inflated medical bills. Our AI-powered platform analyzes medical bills to identify overcharges, billing errors, and opportunities for savings.
                    </p>

                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Our Mission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    To empower families with the tools and knowledge to fight unfair medical billing.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Our Team</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    Healthcare experts, data scientists, and engineers working together for transparency.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Heart className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Our Values</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    Transparency, fairness, and putting families first in everything we do.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
