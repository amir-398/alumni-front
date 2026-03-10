"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { authApi } from "./api/auth"

export type UserRole = "super_admin" | "admin" | "alumni" | "staff"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  promoYear?: number
  diploma?: string
}

const mapBackendUser = (backendUser: any): User | null => {
  if (!backendUser || !backendUser.id) return null
  return {
    id: String(backendUser.id),
    email: backendUser.email || "",
    firstName: backendUser.profile?.first_name || backendUser.first_name || "",
    lastName: backendUser.profile?.last_name || backendUser.last_name || "",
    role: (backendUser.role || "alumni").toLowerCase() as UserRole,
    promoYear: backendUser.profile?.graduation_year,
    diploma: backendUser.profile?.diploma,
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  hasSuperAdmin: boolean
  superAdminEmail: string | null
  superAdminPassword: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  registerSuperAdmin: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hasSuperAdmin, setHasSuperAdmin] = useState(true) 
  const [superAdminEmail, setSuperAdminEmail] = useState<string | null>(null)
  const [superAdminPassword, setSuperAdminPassword] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  console.log("AuthProvider Render:", { user: !!user, isInitializing, hasSuperAdmin })

  useEffect(() => {
    const runInit = async () => {
      console.log("[Auth] Starting async initialization...")
      try {
        const setupRes = await authApi.checkSetupRequired()
        console.log("[Auth] Server setup status:", setupRes)
        setHasSuperAdmin(!setupRes.required)
        
        const token = localStorage.getItem("access_token")
        if (token) {
          const userMe = await authApi.getMe()
          const mapped = mapBackendUser(userMe)
          if (mapped) setUser(mapped)
        }
      } catch (err) {
        console.error("[Auth] Initialization crashed:", err)
      } finally {
        console.log("[Auth] Initialization call finished")
        setIsInitializing(false)
      }
    }

    runInit()
    
    // Safety timeout to never stay on a white page
    const timer = setTimeout(() => {
      console.log("[Auth] Safety timeout reached, forcing render")
      setIsInitializing(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const tokenRes = await authApi.login(email, password)
      localStorage.setItem("access_token", tokenRes.access_token)
      if (tokenRes.refresh_token) {
        localStorage.setItem("refresh_token", tokenRes.refresh_token)
      }

      const userMe = await authApi.getMe()
      setUser(mapBackendUser(userMe))
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || "Erreur lors de la connexion" }
    }
  }, [])

  const registerSuperAdmin = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      await authApi.setup(data.email, data.password, data.firstName, data.lastName)
      setHasSuperAdmin(true)
      // Auto login
      const tokenRes = await login(data.email, data.password)
      return tokenRes
    } catch (error: any) {
      return { success: false, error: error.message || "Erreur lors de la creation du super administrateur" }
    }
  }, [login])

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token")
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => { })
    }
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
  }, [])

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm animate-pulse text-muted-foreground">Initialisation du Hub Alumni...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hasSuperAdmin,
        superAdminEmail,
        superAdminPassword,
        login,
        registerSuperAdmin,
        logout,
      }}
    >
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
