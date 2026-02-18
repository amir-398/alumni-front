export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, token, fetchUser } = useAuth()

  // If we have a token but no user data (e.g. page refresh), try to fetch user
  if (token.value && !user.value) {
    await fetchUser()
  }

  // If no token or fetch failed (token invalid), redirect to login
  if (!token.value || !user.value) {
    return navigateTo('/auth/login')
  }
})
