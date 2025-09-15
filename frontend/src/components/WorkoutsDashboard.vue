<template>
  <div
    class="min-h-screen px-2 bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col py-5"
  >
    <SessionViewModal
      v-if="showSessionModal"
      :workout="selectedWorkout"
      @closeSessionView="showSessionModal = false"
      @deleteSession="handleDeleteSession()"
    />
    <div class="text-center mb-8">
      <h1
        class="text-4xl md:text-5xl font-extrabold text-red-500 mb-2 tracking-tight drop-shadow-lg"
      >
        FitTracker
      </h1>
      <p class="text-gray-400 text-lg">Your fitness progress in one place</p>
    </div>

    <div class="flex-1 px-2 mx-auto max-w-7xl w-full">
      <div class="grid grid-cols-3 md:grid-cols-3 gap-4 mb-8">
        <div
          class="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-4 border border-red-500/30"
        >
          <div class="text-red-400 text-sm font-medium">Total Workouts</div>
          <div class="text-white text-2xl font-bold">{{ workoutStats.total }}</div>
        </div>
        <div
          class="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-4 border border-green-500/30"
        >
          <div class="text-green-400 text-sm font-medium">This Week</div>
          <div class="text-white text-2xl font-bold">{{ workoutStats.thisWeek }}</div>
        </div>
        <div
          class="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border border-blue-500/30"
        >
          <div class="text-blue-400 text-sm font-medium">Streak</div>
          <div class="text-white text-2xl font-bold">{{ workoutStats.streak }} days</div>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 justify-center mb-8">
        <button
          @click="$emit('open-add-session-modal')"
          class="px-6 py-3 cursor-pointer rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Start Workout
        </button>
        <button
          @click="$emit('open-add-template-modal')"
          class="px-6 py-3 cursor-pointer rounded-xl border-2 border-green-500 text-green-400 hover:bg-green-500/10 font-bold transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Create Template
        </button>
        <router-link to="/profile">
          <button
            class="px-6 py-3 cursor-pointer rounded-xl border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 font-bold transition-all duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            View Profile
          </button>
        </router-link>
      </div>

      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-white">Recent Workouts</h2>
          <router-link to="/sessions"
            ><button
              class="text-red-400 cursor-pointer hover:text-red-300 text-sm font-medium transition-colors"
            >
              View All →
            </button></router-link
          >
        </div>

        <div v-if="workouts.length === 0" class="text-center py-12">
          <h3 class="text-xl font-semibold text-gray-400 mb-2">No workouts yet</h3>
          <p class="text-gray-500 mb-6">
            Start your fitness journey by creating your first workout
          </p>
          <button
            @click="$emit('open-add-session-modal')"
            class="px-6 py-3 rounded-xl cursor-pointer bg-red-500 hover:bg-red-600 text-white font-bold transition-colors duration-200"
          >
            Start Your First Workout
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="workout in workouts.slice(0, 3)"
            :key="workout.sessionGuid"
            @click="openSessionView(workout)"
          >
            <SessionCard :workout="workout"></SessionCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import SessionViewModal from './SessionViewModal.vue'
import SessionCard from './SessionCard.vue'
import { getWorkoutSessions } from '@/api/workoutSession'

const showSessionModal = ref(false)
const selectedWorkout = ref({})

const workouts = ref([])
const fetchSessions = async () => {
  const response = await getWorkoutSessions()
  workouts.value = response.sessions
}
const openSessionView = (workout) => {
  selectedWorkout.value = workout
  showSessionModal.value = true
}
const workoutStats = computed(() => {
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  const thisWeekWorkouts = workouts.value.filter((w) => new Date(w.date) >= startOfWeek)

  return {
    total: workouts.value.length,
    thisWeek: thisWeekWorkouts.length,
    streak: calculateStreak(),
  }
})

const calculateStreak = () => {
  const sortedDates = workouts.value
    .map((w) => new Date(w.date).toDateString())
    .sort((a, b) => new Date(b) - new Date(a))

  const uniqueDates = [...new Set(sortedDates)]
  let streak = 0

  for (let i = 0; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i])
    const expectedDate = new Date()
    expectedDate.setDate(expectedDate.getDate() - i)

    if (currentDate.toDateString() === expectedDate.toDateString()) {
      streak++
    } else {
      break
    }
  }
  return streak
}

const handleDeleteSession = async () => {
  await fetchSessions()
}
onMounted(() => {
  fetchSessions()
})

defineExpose({
  fetchSessions,
})
</script>
