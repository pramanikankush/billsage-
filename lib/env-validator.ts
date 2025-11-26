/**
 * Environment variable validator
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string

    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
    CLERK_SECRET_KEY: string

    // Gemini AI
    NEXT_PUBLIC_GEMINI_API_KEY: string
}

/**
 * Validate that a URL is properly formatted
 */
function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * Validate all required environment variables
 * Throws detailed error if any are missing or invalid
 */
export function validateEnvironment(): EnvConfig {
    const errors: string[] = []

    // Check Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
        errors.push("NEXT_PUBLIC_SUPABASE_URL is missing")
    } else if (!isValidUrl(supabaseUrl)) {
        errors.push("NEXT_PUBLIC_SUPABASE_URL is not a valid URL")
    }

    if (!supabaseKey) {
        errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing")
    }

    // Check Clerk
    const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    const clerkSecretKey = process.env.CLERK_SECRET_KEY

    if (!clerkPublishableKey) {
        errors.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing")
    } else if (!clerkPublishableKey.startsWith('pk_')) {
        errors.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY appears to be invalid (should start with 'pk_')")
    }

    if (!clerkSecretKey) {
        errors.push("CLERK_SECRET_KEY is missing")
    } else if (!clerkSecretKey.startsWith('sk_')) {
        errors.push("CLERK_SECRET_KEY appears to be invalid (should start with 'sk_')")
    }

    // Check Gemini
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!geminiKey) {
        errors.push("NEXT_PUBLIC_GEMINI_API_KEY is missing")
    }

    if (errors.length > 0) {
        throw new Error(
            `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join("\n")}\n\nPlease check your .env.local file and ensure all required variables are set.\nSee .env.example for reference.`
        )
    }

    return {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl!,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey!,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: clerkPublishableKey!,
        CLERK_SECRET_KEY: clerkSecretKey!,
        NEXT_PUBLIC_GEMINI_API_KEY: geminiKey!,
    }
}

/**
 * Get validated environment config
 * Call this once at app startup
 */
export function getEnvConfig(): EnvConfig {
    return validateEnvironment()
}
