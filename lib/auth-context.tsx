"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type UserRole = "admin" | "alumni"

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
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (data: RegisterData) => { success: boolean; error?: string }
  logout: () => void
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  promoYear?: number
  diploma?: string
}

// Mock users database
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
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

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

  const register = useCallback((data: RegisterData) => {
    const exists = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    )
    if (exists) {
      return { success: false, error: "Un compte avec cet email existe deja" }
    }
    const newUser: User = {
      id: `alumni-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "alumni",
      promoYear: data.promoYear,
      diploma: data.diploma,
    }
    MOCK_USERS.push({ ...newUser, password: data.password })
    setUser(newUser)
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
        login,
        register,
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
