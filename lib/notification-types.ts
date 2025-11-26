export interface Notification {
    id: string
    type: "bill_analyzed" | "savings_found" | "system" | "reminder"
    title: string
    message: string
    timestamp: string
    read: boolean
    billId?: string
}
