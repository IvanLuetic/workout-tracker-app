<template>
  <div class="fixed inset-0 min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
    <div
      v-if="message || error"
      :class="error ? 'bg-red-500' : 'bg-green-500'"
      class="absolute left-1/2 transform -translate-x-1/2 top-2 max-w-md rounded-lg px-4 py-3 shadow-lg text-white font-medium flex items-center animate-fade-in z-100"
    >
      {{ message || error }}
      <button @click="((message = ''), (error = ''))" class="ml-3 cursor-pointer">
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
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
  try {
    const updateData = {}
    if (data.username) updateData.username = data.username.trim()
    if (data.email) updateData.email = data.username.trim()
    const response = await updateUser(data)
    message.value = response.data.message
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || 'Something went wrong'
  }
}

</script>
