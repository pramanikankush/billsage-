"use client"

import { useEffect, useState } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentBills } from "@/components/dashboard/recent-bills"
import { SavingsChart } from "@/components/dashboard/savings-chart"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { MyPlan } from "@/components/dashboard/my-plan"
import { useAuth } from "@/lib/auth-context"
import * as tempStorage from "@/lib/temp-storage"
import type { DashboardStats, Bill } from "@/lib/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          // Get bills from temp storage
          const bills = await tempStorage.getBills(user.id)

          // Calculate stats
          const totalBills = bills.length
          const totalAnalyzed = bills.filter(b => b.status === "analyzed").length
          const totalSavings = bills.reduce((sum, b) => sum + (b.totalSavings || 0), 0)
          const averageSavingsPerBill = totalAnalyzed > 0 ? totalSavings / totalAnalyzed : 0

          const monthlySavingsMap = new Map<string, number>()
          bills.forEach(bill => {
            if (bill.status === "analyzed" && bill.uploadedAt) {
              const date = new Date(bill.uploadedAt)
              const month = date.toLocaleString('default', { month: 'short' })
              const current = monthlySavingsMap.get(month) || 0
              monthlySavingsMap.set(month, current + (bill.totalSavings || 0))
            }
          })

          const monthlySavings = Array.from(monthlySavingsMap.entries()).map(([month, savings]) => ({
            month,
            savings
          }))

          const totalBilled = bills.reduce((sum, b) => sum + (b.totalBilled || 0), 0)
          const savingsRate = totalBilled > 0 ? (totalSavings / totalBilled) * 100 : 0

          const today = new Date()
          const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
          const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          const currentMonthName = currentMonth.toLocaleString('default', { month: 'short' })
          const lastMonthName = lastMonth.toLocaleString('default', { month: 'short' })

          // Calculate current month savings and billed amounts
          let currentMonthSavings = 0
          let currentMonthBilled = 0
          let previousMonthSavings = 0
          let previousMonthBilled = 0

          bills.forEach(bill => {
            if (bill.status === "analyzed" && bill.uploadedAt) {
              const billDate = new Date(bill.uploadedAt)
              const billMonth = billDate.toLocaleString('default', { month: 'short' })

              if (billMonth === currentMonthName) {
                currentMonthSavings += bill.totalSavings || 0
                currentMonthBilled += bill.totalBilled || 0
              } else if (billMonth === lastMonthName) {
                previousMonthSavings += bill.totalSavings || 0
                previousMonthBilled += bill.totalBilled || 0
              }
            }
          })

          // Calculate savings rates for current and previous month
          const currentMonthSavingsRate = currentMonthBilled > 0 ? (currentMonthSavings / currentMonthBilled) * 100 : 0
          const previousMonthSavingsRate = previousMonthBilled > 0 ? (previousMonthSavings / previousMonthBilled) * 100 : 0

          // Calculate trend (percentage point difference)
          const savingsRateTrend = previousMonthSavingsRate > 0
            ? currentMonthSavingsRate - previousMonthSavingsRate
            : 0

          setStats({
            totalBills,
            totalAnalyzed,
            totalSavings,
            averageSavingsPerBill,
            recentBills: bills.slice(0, 5),
            monthlySavings,
            savingsRate,
            previousMonthSavings,
            savingsRateTrend
          })
        } catch (error) {
          console.error("Failed to load dashboard data:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadData()
  }, [user])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  if (!stats) {
    return <div className="flex items-center justify-center h-full">Failed to load data</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your bill analysis and savings.</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SavingsChart data={stats.monthlySavings} />
        </div>
        <div className="space-y-6">
          <QuickActions />
          {user && <MyPlan user={user} />}
        </div>
      </div>

      <RecentBills bills={stats.recentBills} />
    </div>
  )
}
