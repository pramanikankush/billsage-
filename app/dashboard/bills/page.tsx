"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Upload, FileText, Loader2, Filter } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import * as tempStorage from "@/lib/temp-storage"
import type { Bill } from "@/lib/types"

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const },
  processing: { label: "Processing", variant: "outline" as const },
  ocr: { label: "OCR Processing", variant: "outline" as const },
  analyzing: { label: "Analyzing", variant: "outline" as const },
  analyzed: { label: "Analyzed", variant: "default" as const },
  error: { label: "Error", variant: "destructive" as const },
}

export default function BillsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    async function loadBills() {
      if (user) {
        try {
          const userBills = await tempStorage.getBills(user.id)
          setBills(userBills)
        } catch (error) {
          console.error("Failed to load bills:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadBills()
  }, [user])

  // Update search query when URL parameter changes
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  const filteredBills = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return bills.filter((bill) => {
      const matchesSearch =
        query === "" || bill.provider.toLowerCase().includes(query) || bill.fileName.toLowerCase().includes(query)
      const matchesStatus = statusFilter === "all" || bill.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [bills, searchQuery, statusFilter])

  if (loading) {
    return <div className="flex items-center justify-center h-full p-8">Loading bills...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Bills</h1>
          <p className="text-muted-foreground">View and manage all your uploaded medical bills</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dashboard/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload New Bill
          </Link>
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Bills</CardTitle>
              <CardDescription>{filteredBills.length} bills found</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:w-64 rounded-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 rounded-full">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="analyzed">Analyzed</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Billed</TableHead>
                  <TableHead className="text-right">Savings</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No bills found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBills.map((bill) => {
                    const status = statusConfig[bill.status] || statusConfig.pending
                    return (
                      <TableRow key={bill.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/bills/${bill.id}`}
                            className="flex items-center gap-2 font-medium hover:underline"
                          >
                            {bill.status === "processing" ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            )}
                            {bill.provider}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{bill.fileName}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="rounded-full">
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">${bill.totalBilled?.toLocaleString() ?? 0}</TableCell>
                        <TableCell className="text-right">
                          {bill.status === "analyzed" && (bill.totalSavings ?? 0) > 0 ? (
                            <span className="font-medium text-success">${bill.totalSavings.toLocaleString()}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(bill.uploadedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
