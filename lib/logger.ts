/**
 * Structured logging utility for proper error serialization
 * Fixes the issue where errors appear as {} in console
 */

export interface LogMetadata {
    [key: string]: any
}

export interface SerializedError {
    message: string
    code?: string
    stack?: string
    name?: string
    details?: any
}

/**
 * Serialize an error object to extract all properties
 * Clerk and Supabase errors have non-enumerable properties
 */
export function serializeError(error: any): SerializedError {
    if (!error) return { message: "Unknown error" }

    const serialized: SerializedError = {
        message: error.message || String(error),
        name: error.name,
        stack: error.stack,
    }

    // Clerk Auth errors
    if (error.code) {
        serialized.code = error.code
    }

    // Supabase errors
    if (error.details) {
        serialized.details = error.details
    }
    if (error.hint) {
        serialized.details = { ...serialized.details, hint: error.hint }
    }

    // Extract any custom properties
    Object.keys(error).forEach((key) => {
        if (!serialized[key as keyof SerializedError]) {
            if (serialized.details) {
                serialized.details[key] = error[key]
            } else {
                serialized.details = { [key]: error[key] }
            }
        }
    })

    return serialized
}

/**
 * Get user-friendly error message for Clerk Auth errors
 */
export function getClerkErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
        "form_password_pwned": "This password has been found in a data breach. Please use a different password.",
        "form_identifier_exists": "An account with this email already exists.",
        "form_password_length_too_short": "Password is too short. Please use at least 8 characters.",
        "form_password_no_common_password": "This password is too common. Please use a more unique password.",
        "session_exists": "You are already signed in.",
        "not_allowed_access": "You don't have permission to access this resource.",
        "verification_expired": "Verification code expired. Please request a new one.",
        "verification_failed": "Verification failed. Please try again.",
    }

    return errorMessages[errorCode] || "An unexpected error occurred. Please try again."
}

/**
 * Get user-friendly error message for Supabase errors
 */
export function getSupabaseErrorMessage(error: any): string {
    const code = error.code

    // PostgreSQL error codes
    if (code === "23505") return "This record already exists."
    if (code === "23503") return "Related record not found."
    if (code === "42P01") return "Database table not found. Please contact support."
    if (code === "PGRST116") return "Record not found."

    // Supabase-specific errors
    if (error.message?.includes("JWT")) return "Session expired. Please sign in again."
    if (error.message?.includes("RLS")) return "Permission denied. Please contact support."

    return error.message || "Database error. Please try again."
}

/**
 * Log error with full context and serialization
 */
export function logError(context: string, error: any, metadata?: LogMetadata): void {
    const serialized = serializeError(error)

    console.error(`[ERROR] ${context}`, {
        error: serialized,
        metadata,
        timestamp: new Date().toISOString(),
    })

    // Also log to console for easy debugging
    if (serialized.code) {
        console.error(`  Code: ${serialized.code}`)
    }
    console.error(`  Message: ${serialized.message}`)
    if (serialized.details) {
        console.error(`  Details:`, serialized.details)
    }
}

/**
 * Log info message with context
 */
export function logInfo(context: string, message: string, metadata?: LogMetadata): void {
    console.log(`[INFO] ${context}: ${message}`, metadata ? { metadata, timestamp: new Date().toISOString() } : "")
}

/**
 * Log warning with context
 */
export function logWarning(context: string, message: string, metadata?: LogMetadata): void {
    console.warn(`[WARNING] ${context}: ${message}`, metadata ? { metadata, timestamp: new Date().toISOString() } : "")
}

/**
 * Log success message
 */
export function logSuccess(context: string, message: string, metadata?: LogMetadata): void {
    console.log(`[SUCCESS] ${context}: ${message}`, metadata ? { metadata, timestamp: new Date().toISOString() } : "")
}
