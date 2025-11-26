import { Pool, PoolClient, QueryResult } from "pg"
import { logError, logInfo, logSuccess, logWarning } from "./logger"

/**
 * PostgreSQL Database Connection and Query Utilities
 * Provides connection pooling, parameterized queries, and transaction support
 */

let pool: Pool | null = null

/**
 * Initialize the PostgreSQL connection pool
 */
function getPool(): Pool {
    if (!pool) {
        const databaseUrl = process.env.DATABASE_URL

        if (!databaseUrl) {
            const error = new Error(
                "DATABASE_URL environment variable is not set. Please add it to your .env file."
            )
            logError("PostgreSQL", error)
            throw error
        }

        try {
            pool = new Pool({
                connectionString: databaseUrl,
                max: 20, // Maximum number of clients in the pool
                idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
                connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
            })

            // Handle pool errors
            pool.on("error", (err: Error) => {
                logError("PostgreSQL", err, { context: "Pool error" })
            })

            logSuccess("PostgreSQL", "Connection pool initialized")
        } catch (error) {
            logError("PostgreSQL", error, { context: "Pool initialization" })
            throw error
        }
    }

    return pool
}

/**
 * Execute a SQL query with parameters
 * @param text SQL query string
 * @param params Query parameters
 * @returns Query result
 */
export async function query<T = any>(
    text: string,
    params?: any[]
): Promise<QueryResult<T>> {
    const pool = getPool()
    const start = Date.now()

    try {
        const result = await pool.query<T>(text, params)
        const duration = Date.now() - start

        logInfo("PostgreSQL", "Query executed", {
            duration: `${duration}ms`,
            rows: result.rowCount,
        })

        return result
    } catch (error) {
        logError("PostgreSQL", error, {
            query: text,
            params: params ? "provided" : "none",
        })
        throw error
    }
}

/**
 * Get a client from the pool for transactions
 * Remember to release the client after use!
 */
export async function getClient(): Promise<PoolClient> {
    const pool = getPool()
    try {
        const client = await pool.connect()
        logInfo("PostgreSQL", "Client acquired from pool")
        return client
    } catch (error) {
        logError("PostgreSQL", error, { context: "Getting client" })
        throw error
    }
}

/**
 * Execute a transaction
 * @param callback Function that receives a client and performs queries
 * @returns Result from the callback
 */
export async function transaction<T>(
    callback: (client: PoolClient) => Promise<T>
): Promise<T> {
    const client = await getClient()

    try {
        await client.query("BEGIN")
        logInfo("PostgreSQL", "Transaction started")

        const result = await callback(client)

        await client.query("COMMIT")
        logSuccess("PostgreSQL", "Transaction committed")

        return result
    } catch (error) {
        await client.query("ROLLBACK")
        logWarning("PostgreSQL", "Transaction rolled back")
        logError("PostgreSQL", error, { context: "Transaction" })
        throw error
    } finally {
        client.release()
        logInfo("PostgreSQL", "Client released")
    }
}

/**
 * Test database connection
 * @returns true if connection is successful
 */
export async function testConnection(): Promise<boolean> {
    try {
        const result = await query("SELECT NOW() as current_time")
        logSuccess("PostgreSQL", "Connection test successful", {
            time: result.rows[0].current_time,
        })
        return true
    } catch (error) {
        logError("PostgreSQL", error, { context: "Connection test" })
        return false
    }
}

/**
 * Close the connection pool
 * Call this when shutting down the application
 */
export async function closePool(): Promise<void> {
    if (pool) {
        try {
            await pool.end()
            pool = null
            logSuccess("PostgreSQL", "Connection pool closed")
        } catch (error) {
            logError("PostgreSQL", error, { context: "Closing pool" })
            throw error
        }
    }
}

/**
 * Helper function to convert camelCase to snake_case for database columns
 */
export function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Helper function to convert snake_case to camelCase for JavaScript objects
 */
export function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert database row to camelCase object
 */
export function rowToCamelCase<T = any>(row: any): T {
    const result: any = {}
    for (const key in row) {
        result[toCamelCase(key)] = row[key]
    }
    return result as T
}

/**
 * Convert camelCase object to snake_case for database
 */
export function objectToSnakeCase(obj: any): any {
    const result: any = {}
    for (const key in obj) {
        result[toSnakeCase(key)] = obj[key]
    }
    return result
}
