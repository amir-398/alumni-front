"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

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

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  hasSuperAdmin: boolean
  superAdminEmail: string | null
  superAdminPassword: string | null
  login: (email: string, password: string) => { success: boolean; error?: string }
  registerSuperAdmin: (data: { email: string; password: string; firstName: string; lastName: string }) => { success: boolean; error?: string }
  logout: () => void
}

// Mock users database - starts WITHOUT a super_admin to simulate first-time setup
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "admin-1",
    email: "admin@ecole-multimedia.com",
    password: "admin123",
    firstName: "Marie",
    lastName: "Dupont",
    role: "admin",
  },
  {
    id: "alumni-1",
    email: "sophie.martin@email.com",
    password: "alumni123",
    firstName: "Sophie",
    lastName: "Martin",
    role: "alumni",
    promoYear: 2022,
    diploma: "Master Marketing Digital",
  },
  {
    id: "alumni-2",
    email: "thomas.durand@email.com",
    password: "alumni123",
    firstName: "Thomas",
    lastName: "Durand",
    role: "alumni",
    promoYear: 2021,
    diploma: "Master Finance",
  },
  {
    id: "staff-1",
    email: "staff@ecole-multimedia.com",
    password: "staff123",
    firstName: "Julie",
    lastName: "Moreau",
    role: "staff",
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hasSuperAdmin, setHasSuperAdmin] = useState(() =>
    MOCK_USERS.some((u) => u.role === "super_admin")
  )
  const [superAdminEmail, setSuperAdminEmail] = useState<string | null>(() => {
    const sa = MOCK_USERS.find((u) => u.role === "super_admin")
    return sa?.email ?? null
  })
  const [superAdminPassword, setSuperAdminPassword] = useState<string | null>(() => {
    const sa = MOCK_USERS.find((u) => u.role === "super_admin")
    return sa?.password ?? null
  })

  const login = useCallback((email: string, password: string) => {
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) {
      return { success: false, error: "Email ou mot de passe incorrect" }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pwd, ...userData } = found
    setUser(userData)
    return { success: true }
  }, [])

  const registerSuperAdmin = useCallback((data: { email: string; password: string; firstName: string; lastName: string }) => {
    // Only allow if no super admin exists yet
    const superAdminExists = MOCK_USERS.some((u) => u.role === "super_admin")
    if (superAdminExists) {
      return { success: false, error: "Un super administrateur existe deja" }
    }

    const exists = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    )
    if (exists) {
      return { success: false, error: "Un compte avec cet email existe deja" }
    }

    const newUser: User = {
      id: `superadmin-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "super_admin",
    }
    MOCK_USERS.push({ ...newUser, password: data.password })
    setUser(newUser)
    setHasSuperAdmin(true)
    setSuperAdminEmail(data.email)
    setSuperAdminPassword(data.password)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

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
