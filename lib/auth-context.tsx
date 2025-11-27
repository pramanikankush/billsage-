"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs"
import * as tempStorage from "@/lib/temp-storage"
import type { User, Organization } from "@/lib/types"
import { logError, logInfo, logSuccess } from "@/lib/logger"

interface AuthContextType {
  user: User | null
  organization: Organization | null
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function syncUser() {
      if (!clerkLoaded) {
        setIsLoading(true)
        return
      }

      if (!clerkUser) {
        logInfo("Auth", "No Clerk user found, clearing user state")
        setUser(null)
        setOrganization(null)
        setIsLoading(false)
        return
      }

      try {
        logInfo("Auth", "Starting user sync", {
          userId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress
        })

        // Fetch user profile from database using Clerk user ID
        const profile = await tempStorage.getUser(clerkUser.id)

        if (profile) {
          logSuccess("Auth", "User profile found in database", { userId: profile.id })
          setUser(profile)
          // In a real app, fetch organization details
          setOrganization({
            id: profile.organizationId,
            name: "My Organization",
            plan: "pro",
            createdAt: new Date().toISOString(),
            billCount: 0,
            totalSavings: 0,
          })
        } else {
          // User exists in Clerk but not in Supabase DB - create profile
          logInfo("Auth", "User not found in database, creating new profile", {
            userId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress
          })

          const newUser: Partial<User> = {
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || "",
            name: clerkUser.fullName || clerkUser.firstName || "User",
            role: "user", // Default role
            organizationId: `org_${clerkUser.id}`,
            createdAt: new Date().toISOString(),
            billUploadCount: 0,
            plan: "free",
          }

          const createdUser = await tempStorage.createUser(newUser)
          logSuccess("Auth", "User profile created and synced successfully", { userId: createdUser.id })

          setUser(createdUser)
          setOrganization({
            id: newUser.organizationId!,
            name: "My Organization",
            plan: "pro",
            createdAt: new Date().toISOString(),
            billCount: 0,
            totalSavings: 0,
          })
        }
      } catch (err) {
        logError("Auth", err, {
          operation: "syncUser",
          userId: clerkUser?.id,
          email: clerkUser?.primaryEmailAddress?.emailAddress
        })
        setError("Failed to load user profile. Please try refreshing the page.")
      } finally {
        setIsLoading(false)
      }
    }

    syncUser()
  }, [clerkUser, clerkLoaded])

  return (
    <AuthContext.Provider value={{ user, organization, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
