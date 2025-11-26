"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Mail, FileText, Video, ExternalLink, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function HelpCenterPage() {
    const faqs = [
        {
            question: "How do I upload a medical bill?",
            answer:
                "Navigate to the 'Upload Bill' section in the sidebar. You can drag and drop your bill file (PDF, JPG, PNG) or click to select it from your device. Once uploaded, our AI will automatically analyze it.",
        },
        {
            question: "Is my personal health information secure?",
            answer:
                "Yes, we take security seriously. All data is encrypted in transit and at rest. We comply with standard privacy practices to ensure your sensitive information remains protected.",
        },
        {
            question: "How does the AI analysis work?",
            answer:
                "Our advanced AI scans your bill to identify line items, codes, and potential errors. It compares charges against standard rates and flags any discrepancies or potential savings opportunities.",
        },
        {
            question: "Can I export the analysis report?",
            answer:
                "Yes, once a bill is analyzed, you can view the detailed report and export it as a PDF to share with your healthcare provider or insurance company.",
        },
        {
            question: "What if the AI makes a mistake?",
            answer:
                "While our AI is highly accurate, we recommend reviewing the results. You can manually edit line items if you notice any discrepancies in the digitized data.",
        },
    ]

    const resources = [
        {
            title: "Getting Started Guide",
            description: "Learn the basics of using BillSage",
            icon: FileText,
            href: "#",
        },
        {
            title: "Video Tutorials",
            description: "Watch step-by-step walkthroughs",
            icon: Video,
            href: "#",
        },
        {
            title: "Billing Codes Explained",
            description: "Understand common medical codes",
            icon: ExternalLink,
            href: "#",
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
                <p className="text-muted-foreground">Find answers to common questions and get support.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* FAQ Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                            <CardDescription>Quick answers to common questions about BillSage.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                {/* Support & Resources Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Support</CardTitle>
                            <CardDescription>Need personalized assistance? We're here to help.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 rounded-lg border p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold">Email Support</h4>
                                    <p className="text-sm text-muted-foreground">support@billsage.com</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <a href="mailto:support@billsage.com">Email Us</a>
                                </Button>
                            </div>

                            <div className="flex items-center gap-4 rounded-lg border p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <MessageCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold">Live Chat</h4>
                                    <p className="text-sm text-muted-foreground">Available Mon-Fri, 9am-5pm EST</p>
                                </div>
                                <Button variant="outline" size="sm" disabled>
                                    Offline
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Resources</CardTitle>
                            <CardDescription>Guides and tools to help you get the most out of BillSage.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {resources.map((resource, index) => (
                                    <Link
                                        key={index}
                                        href={resource.href}
                                        className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
                                            <resource.icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium">{resource.title}</h4>
                                            <p className="text-xs text-muted-foreground">{resource.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
