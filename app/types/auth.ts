export type UserRole = 'admin' | 'alumni'
export type UserStatus = 'pending' | 'active' | 'rejected'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status: UserStatus
  linkedinUrl?: string
  graduationYear?: number
  degree?: string
  avatarUrl?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
  linkedinUrl?: string
  graduationYear?: number
  degree?: string
}

export interface AuthResponse {
  token: string
  user: User
}
