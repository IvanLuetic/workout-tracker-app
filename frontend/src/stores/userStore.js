import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { logout } from '@/api/auth'

export const useUserStore = defineStore('userStore', () => {
  const currentUser = ref(null)

  const handleLogout = async () => {
    try {
      await logout()
      currentUser.value = null
      router.push('/')
    } catch (err) {
      console.error(err)
    }
  }

  return { currentUser, handleLogout }
})
