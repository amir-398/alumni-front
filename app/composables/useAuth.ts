import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '~/types/auth'

export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null)
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'lax'
  })
  
  const config = useRuntimeConfig()
  const loading = useState('auth-loading', () => false)
  
  // Login
  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    try {
      const data = await $fetch<AuthResponse>('/auth/login', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: credentials
      })
      
      token.value = data.token
      user.value = data.user
      
      // Redirect to home or dashboard
      await navigateTo('/')
    } catch (error: any) {
      throw error // Let the component handle the error display
    } finally {
      loading.value = false
    }
  }

  // Register
  const register = async (credentials: RegisterCredentials) => {
    loading.value = true
    try {
      await $fetch('/alumni/register', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: credentials
      })
      
      // Usually redirect to a "check your email" or "pending approval" page
      // For now, let's redirect to login with a success message query param
      await navigateTo('/auth/login?registered=true')
    } catch (error: any) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    token.value = null
    user.value = null
    await navigateTo('/auth/login')
  }

  // Check auth status (fetch user profile)
  const fetchUser = async () => {
    if (!token.value) return

    try {
      const data = await $fetch<User>('/auth/me', {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      user.value = data
    } catch (error) {
      // Token invalid or expired
      token.value = null
      user.value = null
    }
  }

  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
    fetchUser
  }
}
