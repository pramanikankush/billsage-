import Link from "next/link"
import { ArrowLeft, Shield, Lock, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HIPAAPage() {
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
                        HIPAA Compliance
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Your health information is protected with the highest security standards
                    </p>
                </div>

                <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground mb-8">
                        BillSage is committed to maintaining the privacy and security of your protected health information (PHI) in compliance with the Health Insurance Portability and Accountability Act (HIPAA).
                    </p>

                    <div className="grid gap-6 md:grid-cols-3 mb-12">
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Data Protection</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    All PHI is encrypted using industry-standard AES-256 encryption both in transit and at rest.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Lock className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Access Controls</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    Strict access controls ensure only authorized personnel can access your health information.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <FileCheck className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Regular Audits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    We conduct regular security audits and risk assessments to maintain compliance.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Our HIPAA Commitments</h2>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>We never sell or share your health information with third parties</li>
                        <li>All employees undergo HIPAA training and background checks</li>
                        <li>We maintain detailed audit logs of all PHI access</li>
                        <li>Business Associate Agreements (BAAs) are in place with all vendors</li>
                        <li>Incident response procedures are established and tested regularly</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Your Rights Under HIPAA</h2>
                    <p className="text-muted-foreground">
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Access and obtain copies of your health information</li>
                        <li>Request corrections to your health information</li>
                        <li>Receive an accounting of disclosures</li>
                        <li>Request restrictions on certain uses and disclosures</li>
                        <li>File a complaint if you believe your privacy rights have been violated</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Contact Our Privacy Officer</h2>
                    <p className="text-muted-foreground">
                        For questions about our HIPAA compliance or to exercise your rights, please contact our Privacy Officer at hipaa@billsage.com
                    </p>
                </div>
            </div>
        </div>
    )
}
