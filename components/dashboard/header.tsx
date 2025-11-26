"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Search, Menu } from "lucide-react"
import type { User } from "@/lib/types"
import type { Notification } from "@/lib/notification-types"

interface DashboardHeaderProps {
  user: User
  onMenuClick?: () => void
  onLogout?: () => void
}

// Mock notifications - in a real app, these would come from an API or database
const mockNotifications: Notification[] = [
  {
    id: "notif_1",
    type: "bill_analyzed",
    title: "Bill Analysis Complete",
    message: "Your ER visit bill has been analyzed. We found $2,480 in potential savings!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
    billId: "bill_3"
  },
  {
    id: "notif_2",
    type: "savings_found",
    title: "High Savings Opportunity",
    message: "Memorial Hospital bill shows charges 3x higher than fair market value.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    billId: "bill_1"
  },
  {
    id: "notif_3",
    type: "reminder",
    title: "Upload Reminder",
    message: "You haven't uploaded any bills this month. Upload now to track your savings!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: "notif_4",
    type: "system",
    title: "Weekly Savings Report",
    message: "Your weekly savings report is ready. Total savings this week: $655",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
  }
]

export function DashboardHeader({ user, onMenuClick, onLogout }: DashboardHeaderProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [searchQuery, setSearchQuery] = useState("")

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const notifDate = new Date(timestamp)
    const diffMs = now.getTime() - notifDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )

    // Navigate to bill if applicable
    if (notification.billId) {
      router.push(`/dashboard/bills/${notification.billId}`)
    }
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/bills?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/dashboard/bills')
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="hidden w-96 md:block">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bills, providers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e)
                  }
                }}
              />
            </div>
          </form>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="text-xs font-normal text-muted-foreground">
                  {notifications.filter(n => !n.read).length} unread
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-blue-50 focus:text-foreground data-[highlighted]:bg-blue-50 data-[highlighted]:text-foreground transition-colors"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary'}`} />
                        <span className="font-medium text-sm">{notification.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-4">{notification.message}</p>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-center justify-center text-sm text-primary cursor-pointer focus:bg-blue-50 focus:text-primary data-[highlighted]:bg-blue-50 data-[highlighted]:text-primary transition-colors"
                  onClick={handleMarkAllRead}
                >
                  Mark all as read
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-blue-50/80 data-[state=open]:bg-blue-50/80 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:block">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer focus:bg-blue-50 focus:text-foreground data-[highlighted]:bg-blue-50 data-[highlighted]:text-foreground transition-colors">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-blue-50 focus:text-foreground data-[highlighted]:bg-blue-50 data-[highlighted]:text-foreground transition-colors">Billing & Plans</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive transition-colors">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
