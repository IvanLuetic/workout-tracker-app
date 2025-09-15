<template>
  <div class="fixed inset-0 min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
    <div
      v-if="message || error"
      :class="error ? 'bg-red-900/70 border-red-700' : 'bg-green-800/70 border-green-700'"
      class="p-4 absolute translate-x-1/2 right-1/2 top-5 border rounded-lg backdrop-blur-xl"
    >
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center">
          <svg
            class="w-5 h-5 text-red-400 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
          <span class="text-red-200 text-sm">{{ error || message }}</span>
        </div>
        <span @click="((error = ''), (message = ''))" class="text-gray-400 text-lg cursor-pointer"
          >x</span
        >
      </div>
    </div>
    <UserProfile @update-profile="handleProfileUpdate" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserProfile from '@/components/UserProfile.vue'
import { updateUser } from '@/api/auth'

const message = ref('')
const error = ref('')
const handleProfileUpdate = async (data) => {
  error.value = ''
  message.value = ''
  try {
    const updateData = {}
    if (data.username) updateData.username = data.username.trim()
    if (data.email) updateData.email = data.username.trim()
    console.log(data)
    const response = await updateUser(data)
    message.value = response.data.message
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || 'Something went wrong'
  }
}
</script>
