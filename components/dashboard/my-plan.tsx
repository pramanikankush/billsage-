"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types"

interface MyPlanProps {
    user: User
}

export function MyPlan({ user }: MyPlanProps) {
    const isFree = user.plan === "free"
    const maxUploads = 3
    const currentUploads = user.billUploadCount || 0
    const usagePercent = isFree ? Math.min((currentUploads / maxUploads) * 100, 100) : 0

    return (
        <Card className="rounded-2xl shadow-sm h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle>My Plan</CardTitle>
                    <Badge variant={isFree ? "secondary" : "default"} className="rounded-full px-3">
                        {isFree ? "Free Tier" : "Pro Plan"}
                    </Badge>
                </div>
                <CardDescription>Manage your subscription and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isFree ? (
                    <>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Bill Uploads</span>
                                <span className="text-muted-foreground">{currentUploads} / {maxUploads} used</span>
                            </div>
                            <Progress value={usagePercent} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                                You have {Math.max(0, maxUploads - currentUploads)} free uploads remaining.
                            </p>
                        </div>

                        <div className="rounded-xl border bg-primary/5 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Crown className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Upgrade to Pro</h4>
                                    <p className="text-xs text-muted-foreground">Unlock unlimited analysis</p>
                                </div>
                            </div>
                            <Button className="mt-3 w-full rounded-full" size="sm" asChild>
                                <Link href="/signup?plan=pro">Upgrade Now</Link>
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-success">
                            <Check className="h-5 w-5" />
                            <span className="font-medium">Active Subscription</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            You have access to all Pro features including unlimited bill analysis and priority support.
                        </p>
                        <Button variant="outline" className="w-full rounded-full" asChild>
                            <Link href="/settings/billing">Manage Billing</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
