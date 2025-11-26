import { AdminStats } from "@/components/admin/admin-stats"
import { OrganizationsTable } from "@/components/admin/organizations-table"

const mockAdminStats = {
  totalOrganizations: 48,
  totalUsers: 312,
  totalBills: 2847,
  totalRevenue: 4850,
  monthlyGrowth: 15,
  activeToday: 67,
}

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground">Monitor platform usage and manage organizations</p>
      </div>

      <AdminStats stats={mockAdminStats} />
      <OrganizationsTable />
    </div>
  )
}
