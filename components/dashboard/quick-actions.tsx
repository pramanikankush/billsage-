import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSearch, Download, HelpCircle } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Upload New Bill",
      description: "Analyze a new hospital bill",
      icon: Upload,
      href: "/dashboard/upload",
      variant: "default" as const,
    },
    {
      title: "View All Bills",
      description: "Browse your analyzed bills",
      icon: FileSearch,
      href: "/dashboard/bills",
      variant: "outline" as const,
    },
    {
      title: "Export Report",
      description: "Download savings summary",
      icon: Download,
      href: "/dashboard/bills", // Placeholder until export page exists
      variant: "outline" as const,
    },
    {
      title: "Get Help",
      description: "FAQs and support",
      icon: HelpCircle,
      href: "/dashboard/help",
      variant: "outline" as const,
    },
  ]

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks to help you save on medical bills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant={action.variant}
              className={`h-auto min-h-[80px] w-full flex-col items-start justify-start gap-1 whitespace-normal rounded-xl p-4 text-left transition-none ${action.variant === "default"
                  ? "hover:bg-primary"
                  : "hover:bg-background hover:text-foreground"
                }`}
              asChild
            >
              <Link href={action.href}>
                <div className="flex w-full items-center gap-2">
                  <action.icon className="h-4 w-4 shrink-0" />
                  <span className="font-medium text-sm leading-tight">{action.title}</span>
                </div>
                <span
                  className={`text-xs font-normal leading-tight mt-1 ${action.variant === "default" ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                >
                  {action.description}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
