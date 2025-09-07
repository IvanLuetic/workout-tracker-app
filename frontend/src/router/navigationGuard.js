import { useUserStore } from '@/stores/userStore'
import { fetchUser } from '@/api/auth'

export const forbidUnauthenticated = async () => {
  const userStore = useUserStore()
  if (userStore.currentUser) return true

  try {
    const user = await fetchUser()
    userStore.currentUser = user
    return true
  } catch {
    return { name: 'AuthPage' }
  }
}
