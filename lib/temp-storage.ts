import type { User, Bill, BillLineItem } from "./types"
import { logError, logInfo, logSuccess } from "./logger"

/**
 * Temporary storage using localStorage
 * This replaces Supabase for development purposes
 */

const STORAGE_KEYS = {
    USERS: "billsage_users",
    BILLS: "billsage_bills",
    LINE_ITEMS: "billsage_line_items",
    FILES: "billsage_files",
} as const

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
    try {
        const test = "__localStorage_test__"
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        return true
    } catch {
        return false
    }
}

// In-memory fallback if localStorage is not available
const memoryStorage: Record<string, any> = {}

function getStorage(key: string): any {
    if (isLocalStorageAvailable()) {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : {}
    }
    return memoryStorage[key] || {}
}

function setStorage(key: string, value: any): void {
    try {
        if (isLocalStorageAvailable()) {
            localStorage.setItem(key, JSON.stringify(value))
        } else {
            memoryStorage[key] = value
        }
    } catch (error) {
        if (error instanceof Error && error.name === "QuotaExceededError") {
            logError("Storage", new Error("Storage quota exceeded. Please clear some data."), { key })
            throw new Error("Storage quota exceeded. Please try uploading a smaller file or clearing your browser data.")
        }
        throw error
    }
}

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<User | null> {
    try {
        const users = getStorage(STORAGE_KEYS.USERS)
        const user = users[userId]

        if (!user) {
            logInfo("TempStorage", "User not found", { userId })
            return null
        }

        return user as User
    } catch (error) {
        logError("TempStorage", error, { operation: "getUser", userId })
        return null
    }
}

/**
 * Create a new user
 */
export async function createUser(user: Partial<User>): Promise<User> {
    try {
        logInfo("TempStorage", "Creating new user", { userId: user.id, email: user.email })

        if (!user.id || !user.email || !user.name) {
            throw new Error("User ID, email, and name are required")
        }

        const users = getStorage(STORAGE_KEYS.USERS)

        // Check if user already exists
        if (users[user.id]) {
            throw new Error("User already exists")
        }

        const newUser: User = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "user",
            organizationId: user.organizationId || `org_${user.id}`,
            createdAt: user.createdAt || new Date().toISOString(),
            billUploadCount: 0,
            plan: "free",
        }

        users[user.id] = newUser
        setStorage(STORAGE_KEYS.USERS, users)

        logSuccess("TempStorage", "User created successfully", { userId: newUser.id })
        return newUser
    } catch (error) {
        logError("TempStorage", error, { operation: "createUser", userId: user.id })
        throw error
    }
}

/**
 * Get user's bill upload count
 */
export async function getUserBillCount(userId: string): Promise<number> {
    const user = await getUser(userId)
    return user ? user.billUploadCount : 0
}

/**
 * Update user's plan
 */
export async function updateUserPlan(userId: string, plan: "free" | "pro" | "enterprise"): Promise<User | null> {
    try {
        const users = getStorage(STORAGE_KEYS.USERS)
        const user = users[userId]

        if (!user) return null

        const updatedUser = { ...user, plan }
        users[userId] = updatedUser
        setStorage(STORAGE_KEYS.USERS, users)

        return updatedUser
    } catch (error) {
        logError("TempStorage", error, { operation: "updateUserPlan", userId })
        return null
    }
}

/**
 * Get all bills for a user
 */
export async function getBills(userId: string): Promise<Bill[]> {
    try {
        const allBills = getStorage(STORAGE_KEYS.BILLS)
        const allLineItems = getStorage(STORAGE_KEYS.LINE_ITEMS)

        // Filter bills by userId
        const userBills = Object.values(allBills).filter((bill: any) => bill.userId === userId)

        // Attach line items to each bill
        const billsWithLineItems = userBills.map((bill: any) => ({
            ...bill,
            lineItems: allLineItems[bill.id] || [],
        }))

        // Sort by uploadedAt descending
        billsWithLineItems.sort((a: any, b: any) => {
            return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        })

        return billsWithLineItems as Bill[]
    } catch (error) {
        logError("TempStorage", error, { operation: "getBills", userId })
        return []
    }
}

/**
 * Get a single bill by ID
 */
export async function getBill(billId: string): Promise<Bill | null> {
    try {
        const allBills = getStorage(STORAGE_KEYS.BILLS)
        const bill = allBills[billId]

        if (!bill) {
            return null
        }

        const allLineItems = getStorage(STORAGE_KEYS.LINE_ITEMS)
        bill.lineItems = allLineItems[billId] || []

        return bill as Bill
    } catch (error) {
        logError("TempStorage", error, { operation: "getBill", billId })
        return null
    }
}

/**
 * Create a new bill with line items
 */
export async function createBill(
    bill: Partial<Bill>,
    lineItems: Partial<BillLineItem>[]
): Promise<Bill> {
    try {
        logInfo("TempStorage", "Creating new bill", { userId: bill.userId, fileName: bill.fileName })

        const billId = `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        const newBill: Bill = {
            id: billId,
            userId: bill.userId!,
            organizationId: bill.organizationId || "",
            fileName: bill.fileName || "unknown",
            fileType: (bill.fileType as "pdf" | "csv" | "image") || "pdf",
            uploadedAt: new Date().toISOString(),
            status: bill.status || "analyzed",
            provider: bill.provider || "",
            totalBilled: bill.totalBilled || 0,
            totalRecommended: bill.totalRecommended || 0,
            totalSavings: bill.totalSavings || 0,
            lineItems: [],
            rawText: bill.rawText,
            parsedJson: bill.parsedJson,
            geminiResponse: bill.geminiResponse,
            ocrMetadata: bill.ocrMetadata,
            errorMessage: bill.errorMessage,
        }

        // Save bill
        const allBills = getStorage(STORAGE_KEYS.BILLS)
        allBills[billId] = newBill
        setStorage(STORAGE_KEYS.BILLS, allBills)

        // Save line items
        if (lineItems.length > 0) {
            const allLineItems = getStorage(STORAGE_KEYS.LINE_ITEMS)
            const billLineItems = lineItems.map((item, index) => ({
                id: `item_${billId}_${index}`,
                billId: billId,
                serviceCode: item.serviceCode || "",
                cptCode: item.cptCode || "",
                description: item.description || "",
                date: item.date || new Date().toISOString().split("T")[0],
                billedAmount: item.billedAmount || 0,
                quantity: item.quantity || 1,
                provider: item.provider || "",
                insurerAllowed: item.insurerAllowed || null,
                patientResponsibility: item.patientResponsibility || 0,
                isOverpriced: item.isOverpriced || false,
                recommendedPrice: item.recommendedPrice || 0,
                confidence: item.confidence || 0,
                reasoning: item.reasoning || "",
                savings: item.savings || 0,
            }))

            allLineItems[billId] = billLineItems
            setStorage(STORAGE_KEYS.LINE_ITEMS, allLineItems)
        }

        // Increment user's bill upload count
        const users = getStorage(STORAGE_KEYS.USERS)
        if (users[bill.userId!]) {
            users[bill.userId!].billUploadCount = (users[bill.userId!].billUploadCount || 0) + 1
            setStorage(STORAGE_KEYS.USERS, users)
        }

        logSuccess("TempStorage", "Bill created successfully", { billId })
        return newBill
    } catch (error) {
        logError("TempStorage", error, { operation: "createBill", userId: bill.userId })
        throw error
    }
}

/**
 * Upload a file (convert to base64 and store)
 */
export async function uploadBillFile(
    file: File,
    userId: string
): Promise<{ path: string; url: string } | null> {
    try {
        logInfo("TempStorage", "Uploading file", { fileName: file.name, size: file.size, userId })

        // Check file size (warn if > 2MB for localStorage)
        const maxSize = 2 * 1024 * 1024 // 2MB
        if (file.size > maxSize) {
            logError(
                "TempStorage",
                new Error("File too large for localStorage"),
                { size: file.size, maxSize }
            )
            // Return null but don't throw - allow processing to continue
            return null
        }

        // Convert file to base64
        const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const result = reader.result as string
                // Remove data URL prefix
                const base64 = result.split(",")[1]
                resolve(base64)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })

        const fileName = `${userId}/${Date.now()}_${file.name}`
        const allFiles = getStorage(STORAGE_KEYS.FILES)

        allFiles[fileName] = {
            path: fileName,
            data: base64Data,
            mimeType: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
        }

        setStorage(STORAGE_KEYS.FILES, allFiles)

        logSuccess("TempStorage", "File uploaded successfully", { path: fileName })

        return {
            path: fileName,
            url: `local://${fileName}`, // Fake URL for compatibility
        }
    } catch (error) {
        logError("TempStorage", error, { operation: "uploadBillFile", fileName: file.name })
        return null
    }
}

/**
 * Get file data
 */
export async function getFile(path: string): Promise<{ data: string; mimeType: string } | null> {
    try {
        const allFiles = getStorage(STORAGE_KEYS.FILES)
        const file = allFiles[path]

        if (!file) {
            return null
        }

        return {
            data: file.data,
            mimeType: file.mimeType,
        }
    } catch (error) {
        logError("TempStorage", error, { operation: "getFile", path })
        return null
    }
}

/**
 * Delete a file
 */
export async function deleteBillFile(path: string): Promise<boolean> {
    try {
        const allFiles = getStorage(STORAGE_KEYS.FILES)
        delete allFiles[path]
        setStorage(STORAGE_KEYS.FILES, allFiles)
        return true
    } catch (error) {
        logError("TempStorage", error, { operation: "deleteBillFile", path })
        return false
    }
}

/**
 * Clear all storage (for testing/reset)
 */
export function clearAllStorage(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
        if (isLocalStorageAvailable()) {
            localStorage.removeItem(key)
        } else {
            delete memoryStorage[key]
        }
    })
    logInfo("TempStorage", "All storage cleared")
}
