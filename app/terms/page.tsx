import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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

                <div className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground mb-8">Last updated: November 26, 2024</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Agreement to Terms</h2>
                    <p className="text-muted-foreground">
                        By accessing or using BillSage, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Use License</h2>
                    <p className="text-muted-foreground">
                        Permission is granted to temporarily use BillSage for personal, non-commercial purposes. This license does not include:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Modifying or copying the materials</li>
                        <li>Using the materials for commercial purposes</li>
                        <li>Attempting to reverse engineer any software</li>
                        <li>Removing any copyright or proprietary notations</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Service Description</h2>
                    <p className="text-muted-foreground">
                        BillSage provides AI-powered medical bill analysis to help identify potential overcharges and billing errors. Our service is for informational purposes only and does not constitute medical, legal, or financial advice.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">User Responsibilities</h2>
                    <p className="text-muted-foreground">
                        You are responsible for:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Maintaining the confidentiality of your account</li>
                        <li>Ensuring the accuracy of information you provide</li>
                        <li>Complying with all applicable laws and regulations</li>
                        <li>Not using the service for any unlawful purpose</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Limitation of Liability</h2>
                    <p className="text-muted-foreground">
                        BillSage shall not be liable for any damages arising from the use or inability to use our service, including but not limited to direct, indirect, incidental, or consequential damages.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Modifications</h2>
                    <p className="text-muted-foreground">
                        We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Contact Information</h2>
                    <p className="text-muted-foreground">
                        For questions about these Terms of Service, please contact us at legal@billsage.com
                    </p>
                </div>
            </div>
        </div>
    )
}
