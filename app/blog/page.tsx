import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BlogPage() {
    const posts = [
        {
            title: "Understanding Your Medical Bill: A Complete Guide",
            excerpt: "Learn how to read and understand every section of your medical bill to identify potential overcharges.",
            date: "Nov 20, 2024",
            category: "Education"
        },
        {
            title: "5 Common Medical Billing Errors to Watch For",
            excerpt: "Discover the most frequent billing mistakes that could be costing you thousands of dollars.",
            date: "Nov 15, 2024",
            category: "Tips"
        },
        {
            title: "How AI is Revolutionizing Healthcare Billing",
            excerpt: "Explore how artificial intelligence is making medical billing more transparent and fair for patients.",
            date: "Nov 10, 2024",
            category: "Technology"
        }
    ]

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
                        Blog
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Insights, tips, and news about medical billing and healthcare costs
                    </p>
                </div>

                <div className="space-y-6">
                    {posts.map((post) => (
                        <Card key={post.title} className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="rounded-full">{post.category}</Badge>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {post.date}
                                    </div>
                                </div>
                                <CardTitle className="text-2xl">{post.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">{post.excerpt}</CardDescription>
                                <Button variant="link" className="mt-4 px-0">
                                    Read more →
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
