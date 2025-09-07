<template>
  <div class="max-w-2xl mx-auto p-4">
    <div class="flex items-center cursor-pointer mb-8">
      <router-link to="/">
        <button
          class="flex items-center cursor-pointer absolute gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back
        </button>
      </router-link>
      <h1 class="text-3xl font-bold w-full text-center text-white">Profile</h1>
    </div>

    <div
      class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-700"
    >
      <div class="space-y-6">
        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2"> Username </label>
          <input
            v-model="editProfile.username"
            type="text"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
            placeholder="Enter your new username"
          />
        </div>

        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2"> Email </label>
          <input
            v-model="editProfile.email"
            type="email"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
            placeholder="Enter your new email"
          />
        </div>

        <button
          @click="saveProfile"
          class="w-full cursor-pointer px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors duration-200"
        >
          Save Changes
        </button>
        <button
          class="w-full cursor-pointer px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors duration-200"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const emit = defineEmits(['update-profile'])

const editProfile = ref({
  username: '',
  email: '',
})

const saveProfile = () => {
  if (!editProfile.value.username && !editProfile.value.email) {
    alert('Enter a username or email')
    return
  }
  emit('update-profile', editProfile.value)
}
const logout = async () => {
  await userStore.handleLogout()
}
</script>
