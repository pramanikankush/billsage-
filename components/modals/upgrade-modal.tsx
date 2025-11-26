"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Zap } from "lucide-react"
import Link from "next/link"

interface UpgradeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                </div>
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">Unlock Unlimited Analysis</DialogTitle>
                    <DialogDescription className="text-center">
                        You've reached your free limit of 3 bills. Upgrade to Pro to analyze unlimited bills and unlock advanced features.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Pro Plan</span>
                            <span className="text-xl font-bold">$19<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                        </div>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="h-4 w-4 text-primary" />
                                Unlimited bill analyses
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="h-4 w-4 text-primary" />
                                Advanced AI reasoning
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="h-4 w-4 text-primary" />
                                Priority support
                            </li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-col">
                    <Button className="w-full rounded-full" size="lg" asChild>
                        <Link href="/signup?plan=pro">Upgrade to Pro</Link>
                    </Button>
                    <Button variant="ghost" className="w-full rounded-full" onClick={() => onOpenChange(false)}>
                        Maybe Later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
