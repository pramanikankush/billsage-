/**
 * CURRENTLY NOT IN USE - Using temp-storage.ts instead
 * This file is kept for easy restoration of Supabase integration later
 */

import { createBrowserClient } from "@supabase/ssr"

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

/**
 * Get or create a Supabase client instance
 * @throws {Error} If required environment variables are missing
 * @returns Supabase client instance
 */
export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    const missingVars = []
    if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL")
    if (!supabaseKey) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    throw new Error(
      `Missing Supabase environment variables: ${missingVars.join(", ")}. ` +
      `Please check your .env file and ensure all required variables are set. ` +
      `See .env.example for reference.`
    )
  }

  console.log("[Supabase] Initializing client with URL:", supabaseUrl.substring(0, 30) + "...")
  supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey)

  return supabaseInstance
}

/** Storage bucket name for bills */
export const BILLS_BUCKET = "bills"

/**
 * Upload a bill file to Supabase Storage
 * @param file - The file to upload
 * @param userId - The user ID to organize files by user
 * @returns Object containing the file path and public URL, or null if upload fails
 */
export async function uploadBillFile(file: File, userId: string): Promise<{ path: string; url: string } | null> {
  const supabase = getSupabaseClient()

  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}/${Date.now()}_${file.name}`

  const { data, error } = await supabase.storage.from(BILLS_BUCKET).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("[v0] Supabase upload error:", error)
    return null
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(BILLS_BUCKET).getPublicUrl(data.path)

  return {
    path: data.path,
    url: urlData.publicUrl,
  }
}

/**
 * Delete a bill file from Supabase Storage
 * @param path - The file path to delete
 * @returns True if deletion was successful, false otherwise
 */
export async function deleteBillFile(path: string): Promise<boolean> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.storage.from(BILLS_BUCKET).remove([path])

  if (error) {
    console.error("[v0] Supabase delete error:", error)
    return false
  }

  return true
}

/**
 * List all bills for a specific user
 * @param userId - The user ID to list bills for
 * @returns Array of bill file metadata
 */
export async function listUserBills(userId: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.storage.from(BILLS_BUCKET).list(userId, {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  })

  if (error) {
    console.error("[v0] Supabase list error:", error)
    return []
  }

  return data
}
