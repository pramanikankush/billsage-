"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, ChevronDown, Info } from "lucide-react"
import type { BillLineItem } from "@/lib/types"

interface LineItemCardProps {
  item: BillLineItem
  index: number
}

export function LineItemCard({ item, index }: LineItemCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const savingsPercentage = item.billedAmount > 0 ? Math.round((item.savings / item.billedAmount) * 100) : 0

  return (
    <Card className={`rounded-2xl ${item.isOverpriced ? "border-warning/50 bg-warning/5" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                item.isOverpriced ? "bg-warning/20" : "bg-success/20"
              }`}
            >
              {item.isOverpriced ? (
                <AlertTriangle className="h-5 w-5 text-warning" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-success" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                {item.cptCode && (
                  <Badge variant="outline" className="rounded-full font-mono text-xs">
                    CPT {item.cptCode}
                  </Badge>
                )}
                <Badge variant={item.isOverpriced ? "destructive" : "secondary"} className="rounded-full">
                  {item.isOverpriced ? "Overpriced" : "Fair Price"}
                </Badge>
              </div>
              <h3 className="mt-1 font-semibold text-foreground">{item.description}</h3>
              <p className="text-sm text-muted-foreground">
                {item.provider} • {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
            <div className="text-right">
              <p className="text-xl font-bold text-foreground">${item.billedAmount.toLocaleString()}</p>
              {item.savings > 0 && (
                <p className="text-sm font-semibold text-success">Save ${item.savings.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-muted-foreground">Recommended Price</span>
            <span className="font-semibold">${item.recommendedPrice.toLocaleString()}</span>
          </div>

          {item.insurerAllowed && (
            <div className="flex items-center justify-between text-sm rounded-lg bg-muted/50 px-3 py-2">
              <span className="text-muted-foreground">Insurance Allowed</span>
              <span className="font-semibold">${item.insurerAllowed.toLocaleString()}</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">AI Confidence</span>
              <span className="font-semibold">{item.confidence}%</span>
            </div>
            <Progress value={item.confidence} className="h-2 rounded-full" />
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between rounded-xl">
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {isOpen ? "Hide" : "Show"} Analysis Details
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 rounded-xl bg-muted/50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-foreground">AI Reasoning</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.reasoning}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  )
}
