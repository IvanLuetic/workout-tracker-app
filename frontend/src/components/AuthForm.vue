<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-800 px-4"
  >
    <div class="w-full max-w-md relative">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">FitTracker</h1>
        <p class="text-gray-300 text-sm">Track your fitness journey</p>
      </div>

      <div
        v-if="errors"
        class="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg backdrop-blur-sm"
      >
        <div class="flex items-center justify-between">
          <div class="flex">
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
            <span class="text-red-200 text-sm">{{ errors }}</span>
          </div>
          <span @click="errors = ''" class="text-gray-400 text-lg cursor-pointer">x</span>
        </div>
      </div>

      <div
        class="flex flex-col bg-black/30 border border-gray-700/50 rounded-2xl p-8 pt-5 shadow-2xl"
      >
        <div class="flex justify-center items-center mb-5">
          <h3 class="text-center tracking-wide">
            {{ isLogin ? 'Log in' : 'Register' }}
          </h3>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </div>
            <input
              placeholder="Username"
              type="text"
              v-model="username"
              class="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div v-if="!isLogin" class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                ></path>
              </svg>
            </div>
            <input
              placeholder="Email"
              type="email"
              v-model="email"
              class="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <input
              placeholder="Password"
              type="password"
              v-model="password"
              class="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 px-4 text-white bg-green-500 hover:bg-green-600 cursor-pointer font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none"
          >
            <span v-if="isLogin">Sign In</span>
            <span v-else>Sign Up</span>
          </button>
        </form>
        <div class="mt-6 text-center">
          <p class="text-gray-400 text-sm">
            <span v-if="isLogin">Don't have an account?</span>
            <span v-else>Already have an account?</span>
            <span
              @click="isLogin = !isLogin"
              class="ml-2 text-red-400 hover:text-red-300 font-medium cursor-pointer hover:underline"
            >
              <span v-if="isLogin">Sign up here</span>
              <span v-else>Sign in here</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { login, signUp } from '@/api/auth'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const isLogin = ref(false)
const userStore = useUserStore()
const errors = ref('')
const router = useRouter()

const handleSubmit = async () => {
  const data = {
    username: username.value,
    email: email.value,
    password: password.value,
  }
  console.log(data)
  try {
    const response = await (isLogin.value
      ? login({ username: username.value, password: password.value })
      : signUp({ username: username.value, email: email.value, password: password.value }))
    userStore.currentUser = response.data.user
    router.push({
      name: 'HomePage',
    })
  } catch (err) {
    console.error(err)
    errors.value = err.response?.data.message || 'Something went wrong.'
  }
}
</script>
