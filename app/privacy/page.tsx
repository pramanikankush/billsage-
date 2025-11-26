import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground mb-8">Last updated: November 26, 2024</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Introduction</h2>
                    <p className="text-muted-foreground">
                        At BillSage, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our medical bill analysis service.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
                    <p className="text-muted-foreground">
                        We collect information that you provide directly to us, including:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Account information (name, email address)</li>
                        <li>Medical bill data you upload for analysis</li>
                        <li>Payment information for subscription services</li>
                        <li>Communications with our support team</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
                    <p className="text-muted-foreground">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Provide and improve our bill analysis services</li>
                        <li>Process your payments and manage your account</li>
                        <li>Send you important updates and notifications</li>
                        <li>Respond to your questions and support requests</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Data Security</h2>
                    <p className="text-muted-foreground">
                        We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. All medical data is encrypted both in transit and at rest.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Your Rights</h2>
                    <p className="text-muted-foreground">
                        You have the right to access, correct, or delete your personal information at any time. You can also request a copy of your data or opt-out of certain data processing activities.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
                    <p className="text-muted-foreground">
                        If you have any questions about this Privacy Policy, please contact us at privacy@billsage.com
                    </p>
                </div>
            </div>
        </div>
    )
}
