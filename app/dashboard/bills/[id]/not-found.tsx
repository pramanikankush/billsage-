import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function BillNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-foreground">Bill Not Found</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        We couldn't find the bill you're looking for. It may have been deleted or the link is incorrect.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/dashboard/bills">View All Bills</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/upload">Upload New Bill</Link>
        </Button>
      </div>
    </div>
  )
}
