import Link from "next/link"
import { ArrowLeft, Briefcase, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CareersPage() {
    const positions = [
        {
            title: "Senior Full Stack Engineer",
            department: "Engineering",
            location: "Remote",
            type: "Full-time"
        },
        {
            title: "Healthcare Data Analyst",
            department: "Data Science",
            location: "Remote",
            type: "Full-time"
        },
        {
            title: "Product Designer",
            department: "Design",
            location: "Remote",
            type: "Full-time"
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
                        Careers
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Join us in making healthcare costs transparent and fair for everyone
                    </p>
                </div>

                <div className="mb-12 rounded-2xl bg-primary/5 p-8">
                    <h2 className="text-2xl font-bold mb-4">Why Join BillSage?</h2>
                    <p className="text-muted-foreground">
                        We're a mission-driven team working to solve one of healthcare's biggest problems: billing transparency.
                        Join us to make a real impact on families' lives while working with cutting-edge AI technology.
                    </p>
                </div>

                <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
                <div className="space-y-4">
                    {positions.map((position) => (
                        <Card key={position.title} className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{position.title}</CardTitle>
                                        <CardDescription className="mt-2 flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="h-4 w-4" />
                                                {position.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {position.location}
                                            </span>
                                        </CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="rounded-full">{position.type}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button className="rounded-full">Apply Now</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
