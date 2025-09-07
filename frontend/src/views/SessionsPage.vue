<template>
  <div
    class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col py-5"
  >
    <div class="px-2 mx-auto max-w-7xl w-full">
      <SessionViewModal
        v-if="showSessionView"
        :workout="selectedWorkout"
        @closeSessionView="showSessionView = false"
        @deleteSession="handleDeleteSession()"
      />

      <div class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-2">
        <router-link to="/">
          <button
            class="flex items-center cursor-pointer gap-2 text-gray-400 hover:text-white transition-colors duration-200 px-4 rounded-lg hover:bg-gray-800"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Back to Home
          </button>
        </router-link>
        <h2 class="text-center font-extrabold text-red-500 mb-2 tracking-tight drop-shadow-lg">
          My workouts
        </h2>
        <div class="w-[180px]">
          <select
            class="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none"
            v-model="selectedTemplate"
            @click="getUserTemplates"
          >
            <option value="" selected>All Templates</option>
            <option
              v-for="template in workoutTemplates"
              :key="template.templateGuid"
              :value="template.name"
            >
              {{ template.name }}
            </option>
          </select>
        </div>
      </div>
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          v-for="workout in workouts"
          :key="workout.sessionGuid"
          @click="openSessionView(workout)"
        >
          <SessionCard :workout="workout"></SessionCard>
        </div>
      </div>

      <div v-if="!loading && workouts.length === 0" class="text-center py-12">
        <div class="text-gray-500 text-6xl mb-4">💪</div>
        <h3 class="text-xl font-semibold text-gray-400 mb-2">No workouts found</h3>
        <p class="text-gray-500">Start your fitness journey by creating your first workout</p>
      </div>

      <div v-if="!loading && totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-2 rounded-lg font-medium transition-colors',
            currentPage === 1
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 text-gray-300 cursor-pointer hover:bg-gray-600 hover:text-white',
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-2 cursor-pointer rounded-lg font-medium transition-colors min-w-[40px]',
            page === currentPage
              ? 'bg-red-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          :class="[
            'px-3 py-2 cursor-pointer rounded-lg font-medium transition-colors',
            currentPage === totalPages
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white',
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>

      <div v-if="!loading && workouts.length > 0" class="text-center mt-4 text-gray-400 text-sm">
        Showing {{ (currentPage - 1) * pageSize + 1 }} to
        {{ Math.min(currentPage * pageSize, totalWorkouts) }} of {{ totalWorkouts }} workouts
      </div>
    </div>
  </div>
</template>

<script setup>
import SessionCard from '@/components/SessionCard.vue'
import SessionViewModal from '@/components/SessionViewModal.vue'
import { getWorkoutSessions } from '@/api/workoutSession'
import { onMounted, ref, computed, watch } from 'vue'
import { getAllWorkoutTemplates } from '@/api/workoutTemplate'

const workouts = ref([])
const workoutTemplates = ref([])
const selectedWorkout = ref({})
const selectedTemplate = ref('')
const showSessionView = ref(false)
const loading = ref(false)

watch(selectedTemplate, async (newValue) => {
  if (newValue !== '') {
    await fetchSessions(currentPage.value, pageSize.value, newValue)
  } else {
    await fetchSessions(currentPage.value, pageSize.value)
  }
})

const currentPage = ref(1)
const pageSize = ref(6)
const totalWorkouts = ref(0)
const totalPages = computed(() => Math.ceil(totalWorkouts.value / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  for (let i = 1; i <= total; i++) {
    pages.push(i)
  }
  return pages
})
const openSessionView = (workout) => {
  selectedWorkout.value = workout
  showSessionView.value = true
}

const fetchSessions = async (page = 1, pageSize = 6, templateName = '') => {
  loading.value = true
  try {
    const response = await getWorkoutSessions(page, pageSize, templateName)
    workouts.value = response.sessions
    totalWorkouts.value = response.total
    currentPage.value = page
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    fetchSessions(page, pageSize.value, selectedTemplate.value)
  }
}

const handleDeleteSession = async () => {
  await fetchSessions(currentPage.value, pageSize.value, selectedTemplate.value) // Pass all parameters
}

const getUserTemplates = async () => {
  const templates = await getAllWorkoutTemplates()
  workoutTemplates.value = templates
}

onMounted(() => {
  fetchSessions(1)
})
</script>
