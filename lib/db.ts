import * as postgres from "./postgres"
import type { User, Bill, DashboardStats, BillLineItem } from "./types"
import { logError, logInfo, logSuccess } from "./logger"

/**
 * Database operations using PostgreSQL
 * Replaces temporary localStorage storage with persistent database
 */

export const db = {
    /**
     * Get user by ID
     */
    async getUser(userId: string): Promise<User | null> {
        try {
            const result = await postgres.query<any>(
                "SELECT * FROM users WHERE id = $1",
                [userId]
            )

            if (result.rows.length === 0) {
                logInfo("Database", "User not found", { userId })
                return null
            }

            const row = result.rows[0]
            return {
                id: row.id,
                email: row.email,
                name: row.name,
                role: "user",
                organizationId: row.organization_id,
                createdAt: row.created_at,
                billUploadCount: row.bill_upload_count || 0,
                plan: row.plan || "free",
            }
        } catch (error) {
            logError("Database", error, { operation: "getUser", userId })
            return null
        }
    },

    /**
     * Create a new user
     */
    async createUser(user: Partial<User>): Promise<User> {
        try {
            logInfo("Database", "Creating new user", { userId: user.id, email: user.email })

            if (!user.id || !user.email || !user.name) {
                throw new Error("User ID, email, and name are required")
            }

            const result = await postgres.query<any>(
                `INSERT INTO users (id, email, name, role, organization_id, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [
                    user.id,
                    user.email,
                    user.name,
                    user.role || "user",
                    user.organizationId || `org_${user.id}`,
                    user.createdAt || new Date().toISOString(),
                ]
            )

            const row = result.rows[0]
            const newUser: User = {
                id: row.id,
                email: row.email,
                name: row.name,
                role: "user",
                organizationId: row.organization_id,
                createdAt: row.created_at,
                billUploadCount: row.bill_upload_count || 0,
                plan: row.plan || "free",
            }

            logSuccess("Database", "User created successfully", { userId: newUser.id })
            return newUser
        } catch (error) {
            logError("Database", error, { operation: "createUser", userId: user.id })
            throw error
        }
    },

    /**
     * Get all bills for a user
     */
    async getBills(userId: string): Promise<Bill[]> {
        try {
            const result = await postgres.query(
                `SELECT b.*, 
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', li.id,
                                'billId', li.bill_id,
                                'serviceCode', li.service_code,
                                'cptCode', li.cpt_code,
                                'description', li.description,
                                'date', li.date,
                                'billedAmount', li.billed_amount,
                                'quantity', li.quantity,
                                'provider', li.provider,
                                'insurerAllowed', li.insurer_allowed,
                                'patientResponsibility', li.patient_responsibility,
                                'isOverpriced', li.is_overpriced,
                                'recommendedPrice', li.recommended_price,
                                'confidence', li.confidence,
                                'reasoning', li.reasoning,
                                'savings', li.savings
                            )
                        ) FILTER (WHERE li.id IS NOT NULL),
                        '[]'
                    ) as line_items
                 FROM bills b
                 LEFT JOIN bill_line_items li ON b.id = li.bill_id
                 WHERE b.user_id = $1
                 GROUP BY b.id
                 ORDER BY b.uploaded_at DESC`,
                [userId]
            )

            const bills: Bill[] = result.rows.map((row: any) => ({
                id: row.id,
                userId: row.user_id,
                organizationId: row.organization_id,
                fileName: row.file_name,
                fileType: row.file_type as "pdf" | "csv" | "image",
                filePath: row.file_path,
                uploadedAt: row.uploaded_at,
                status: row.status as "pending" | "processing" | "analyzed" | "error",
                provider: row.provider,
                totalBilled: parseFloat(row.total_billed) || 0,
                totalRecommended: parseFloat(row.total_recommended) || 0,
                totalSavings: parseFloat(row.total_savings) || 0,
                lineItems: row.line_items || [],
                rawText: row.raw_text,
                parsedJson: row.parsed_json,
                geminiResponse: row.gemini_response,
                ocrMetadata: row.ocr_metadata,
                errorMessage: row.error_message,
            }))

            return bills
        } catch (error) {
            logError("Database", error, { operation: "getBills", userId })
            return []
        }
    },

    /**
     * Create a new bill with line items
     */
    async createBill(bill: Partial<Bill>, lineItems: Partial<BillLineItem>[]): Promise<Bill> {
        try {
            logInfo("Database", "Creating new bill", { userId: bill.userId, fileName: bill.fileName })

            const billId = `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

            // Use transaction to ensure both bill and line items are created together
            const newBill = await postgres.transaction(async (client) => {
                // Insert bill
                const billResult = await client.query(
                    `INSERT INTO bills (
                        id, user_id, organization_id, file_name, file_type, file_path,
                        uploaded_at, status, provider, total_billed, total_recommended,
                        total_savings, raw_text, parsed_json, gemini_response,
                        ocr_metadata, error_message
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                    RETURNING *`,
                    [
                        billId,
                        bill.userId,
                        bill.organizationId || "",
                        bill.fileName || "unknown",
                        bill.fileType || "pdf",
                        bill.filePath || null,
                        new Date().toISOString(),
                        bill.status || "analyzed",
                        bill.provider || "",
                        bill.totalBilled || 0,
                        bill.totalRecommended || 0,
                        bill.totalSavings || 0,
                        bill.rawText || null,
                        bill.parsedJson ? JSON.stringify(bill.parsedJson) : null,
                        bill.geminiResponse ? JSON.stringify(bill.geminiResponse) : null,
                        bill.ocrMetadata ? JSON.stringify(bill.ocrMetadata) : null,
                        bill.errorMessage || null,
                    ]
                )

                const billRow = billResult.rows[0]

                // Insert line items
                const insertedLineItems: BillLineItem[] = []
                if (lineItems.length > 0) {
                    for (let i = 0; i < lineItems.length; i++) {
                        const item = lineItems[i]
                        const itemId = `item_${billId}_${i}`

                        const itemResult = await client.query(
                            `INSERT INTO bill_line_items (
                                id, bill_id, service_code, cpt_code, description, date,
                                billed_amount, quantity, provider, insurer_allowed,
                                patient_responsibility, is_overpriced, recommended_price,
                                confidence, reasoning, savings
                            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                            RETURNING *`,
                            [
                                itemId,
                                billId,
                                item.serviceCode || "",
                                item.cptCode || "",
                                item.description || "",
                                item.date || new Date().toISOString().split("T")[0],
                                item.billedAmount || 0,
                                item.quantity || 1,
                                item.provider || "",
                                item.insurerAllowed || null,
                                item.patientResponsibility || 0,
                                item.isOverpriced || false,
                                item.recommendedPrice || 0,
                                item.confidence || 0,
                                item.reasoning || "",
                                item.savings || 0,
                            ]
                        )

                        const itemRow = itemResult.rows[0]
                        insertedLineItems.push({
                            id: itemRow.id,
                            billId: itemRow.bill_id,
                            serviceCode: itemRow.service_code,
                            cptCode: itemRow.cpt_code,
                            description: itemRow.description,
                            date: itemRow.date,
                            billedAmount: parseFloat(itemRow.billed_amount),
                            quantity: itemRow.quantity,
                            provider: itemRow.provider,
                            insurerAllowed: itemRow.insurer_allowed ? parseFloat(itemRow.insurer_allowed) : null,
                            patientResponsibility: parseFloat(itemRow.patient_responsibility),
                            isOverpriced: itemRow.is_overpriced,
                            recommendedPrice: parseFloat(itemRow.recommended_price),
                            confidence: parseFloat(itemRow.confidence),
                            reasoning: itemRow.reasoning,
                            savings: parseFloat(itemRow.savings),
                        })
                    }
                }

                return {
                    id: billRow.id,
                    userId: billRow.user_id,
                    organizationId: billRow.organization_id,
                    fileName: billRow.file_name,
                    fileType: billRow.file_type as "pdf" | "csv" | "image",
                    filePath: billRow.file_path,
                    uploadedAt: billRow.uploaded_at,
                    status: billRow.status as "pending" | "processing" | "analyzed" | "error",
                    provider: billRow.provider,
                    totalBilled: parseFloat(billRow.total_billed),
                    totalRecommended: parseFloat(billRow.total_recommended),
                    totalSavings: parseFloat(billRow.total_savings),
                    lineItems: insertedLineItems,
                    rawText: billRow.raw_text,
                    parsedJson: billRow.parsed_json,
                    geminiResponse: billRow.gemini_response,
                    ocrMetadata: billRow.ocr_metadata,
                    errorMessage: billRow.error_message,
                }
            })

            logSuccess("Database", "Bill created successfully", { billId })
            return newBill
        } catch (error) {
            logError("Database", error, { operation: "createBill", userId: bill.userId })
            throw error
        }
    },

    /**
     * Get a single bill by ID
     */
    async getBill(billId: string): Promise<Bill | null> {
        try {
            const result = await postgres.query(
                `SELECT b.*, 
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', li.id,
                                'billId', li.bill_id,
                                'serviceCode', li.service_code,
                                'cptCode', li.cpt_code,
                                'description', li.description,
                                'date', li.date,
                                'billedAmount', li.billed_amount,
                                'quantity', li.quantity,
                                'provider', li.provider,
                                'insurerAllowed', li.insurer_allowed,
                                'patientResponsibility', li.patient_responsibility,
                                'isOverpriced', li.is_overpriced,
                                'recommendedPrice', li.recommended_price,
                                'confidence', li.confidence,
                                'reasoning', li.reasoning,
                                'savings', li.savings
                            )
                        ) FILTER (WHERE li.id IS NOT NULL),
                        '[]'
                    ) as line_items
                 FROM bills b
                 LEFT JOIN bill_line_items li ON b.id = li.bill_id
                 WHERE b.id = $1
                 GROUP BY b.id`,
                [billId]
            )

            if (result.rows.length === 0) {
                return null
            }

            const row = result.rows[0]
            return {
                id: row.id,
                userId: row.user_id,
                organizationId: row.organization_id,
                fileName: row.file_name,
                fileType: row.file_type as "pdf" | "csv" | "image",
                filePath: row.file_path,
                uploadedAt: row.uploaded_at,
                status: row.status as "pending" | "processing" | "analyzed" | "error",
                provider: row.provider,
                totalBilled: parseFloat(row.total_billed) || 0,
                totalRecommended: parseFloat(row.total_recommended) || 0,
                totalSavings: parseFloat(row.total_savings) || 0,
                lineItems: row.line_items || [],
                rawText: row.raw_text,
                parsedJson: row.parsed_json,
                geminiResponse: row.gemini_response,
                ocrMetadata: row.ocr_metadata,
                errorMessage: row.error_message,
            }
        } catch (error) {
            logError("Database", error, { operation: "getBill", billId })
            return null
        }
    },

    /**
     * Get dashboard statistics for a user
     */
    async getDashboardStats(userId: string): Promise<DashboardStats> {
        const bills = await this.getBills(userId)

        const totalBills = bills.length
        const totalAnalyzed = bills.filter((b) => b.status === "analyzed").length
        const totalSavings = bills.reduce((sum, b) => sum + (b.totalSavings || 0), 0)
        const averageSavingsPerBill = totalAnalyzed > 0 ? totalSavings / totalAnalyzed : 0

        // Calculate monthly savings
        const monthlySavingsMap = new Map<string, number>()
        bills.forEach((bill) => {
            if (bill.status === "analyzed" && bill.uploadedAt) {
                const date = new Date(bill.uploadedAt)
                const month = date.toLocaleString("default", { month: "short" })
                const current = monthlySavingsMap.get(month) || 0
                monthlySavingsMap.set(month, current + (bill.totalSavings || 0))
            }
        })

        const monthlySavings = Array.from(monthlySavingsMap.entries()).map(([month, savings]) => ({
            month,
            savings,
        }))

        const totalBilled = bills.reduce((sum, b) => sum + (b.totalBilled || 0), 0)
        const savingsRate = totalBilled > 0 ? (totalSavings / totalBilled) * 100 : 0

        // Calculate previous month savings for trend
        const today = new Date()
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastMonthName = lastMonth.toLocaleString("default", { month: "short" })
        const previousMonthSavings = monthlySavingsMap.get(lastMonthName) || 0

        return {
            totalBills,
            totalAnalyzed,
            totalSavings,
            averageSavingsPerBill,
            recentBills: bills.slice(0, 5),
            monthlySavings,
            savingsRate,
            previousMonthSavings,
            savingsRateTrend: 0,
        }
    },
}
