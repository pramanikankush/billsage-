"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Search, Edit2 } from "lucide-react"

const mockPricingData = [
  { cpt: "99213", description: "Office visit, established, moderate", medicare: 110, fairMin: 120, fairMax: 180 },
  { cpt: "99214", description: "Office visit, established, mod-high", medicare: 165, fairMin: 180, fairMax: 280 },
  { cpt: "36415", description: "Venipuncture", medicare: 8, fairMin: 10, fairMax: 25 },
  { cpt: "80053", description: "Comprehensive metabolic panel", medicare: 35, fairMin: 40, fairMax: 80 },
  { cpt: "71046", description: "Chest X-ray, 2 views", medicare: 65, fairMin: 80, fairMax: 150 },
]

export function PricingManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [editingRow, setEditingRow] = useState<string | null>(null)

  const filteredData = mockPricingData.filter(
    (row) => row.cpt.includes(searchQuery) || row.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Pricing Reference Data</CardTitle>
              <CardDescription>Manage CPT code pricing benchmarks for analysis</CardDescription>
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by CPT or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CPT Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Medicare Rate</TableHead>
                  <TableHead className="text-right">Fair Min</TableHead>
                  <TableHead className="text-right">Fair Max</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.cpt}>
                    <TableCell className="font-mono">{row.cpt}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell className="text-right">${row.medicare}</TableCell>
                    <TableCell className="text-right">${row.fairMin}</TableCell>
                    <TableCell className="text-right">${row.fairMax}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New CPT Code</CardTitle>
          <CardDescription>Add a new pricing benchmark to the database</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="cpt">CPT Code</Label>
              <Input id="cpt" placeholder="99213" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" placeholder="Service description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicare">Medicare Rate</Label>
              <Input id="medicare" type="number" placeholder="0.00" />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Add Code
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
