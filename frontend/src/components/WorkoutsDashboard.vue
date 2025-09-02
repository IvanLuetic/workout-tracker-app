<template>
  <div
    class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col justify-between items-center py-5"
  >
    <div>
      <h1 class="font-extrabold text-red-500 mb-8 tracking-tight drop-shadow-lg text-center">
        Workout Logger
      </h1>
    </div>
    <div class="w-full max-w-4xl flex flex-col items-center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-10">
        <div
          v-for="workout in listWorkouts"
          :key="workout.id"
          class="rounded-2xl bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700 shadow-2xl border border-red-500 hover:scale-105 transition-transform duration-200"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-2xl font-semibold text-red-400">{{ workout.name }}</h3>
              <span class="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                {{ workout.date }}
              </span>
            </div>
            <ul class="mt-4 space-y-2">
              <li
                v-for="(exercise, idx) in workout.SessionExercises"
                :key="idx"
                class="flex items-center gap-2 text-gray-200"
              >
                <span class="inline-block w-2 h-2 bg-red-400 rounded-full"></span>
                {{ exercise.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flex mb-4 gap-6 mx-2">
        <button
          @click="$emit('open-add-session-modal')"
          class="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg cursor-pointer transition-colors duration-150"
        >
          Add New Session
        </button>
        <button
          @click="$emit('open-add-template-modal')"
          class="px-6 py-3 rounded-xl border-2 border-green-500 text-red-500 hover:text-green-600 font-bold cursor-pointer shadow-lg transition-colors duration-150"
        >
          Add New Template
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const { workouts } = defineProps({
  workouts: {
    type: Array,
  },
})
const listWorkouts = computed(() => {
  return workouts.map((workout) => {
    return {
      ...workout,
      date: formatDate(workout.date),
      exercises: workout.SessionExercises.slice(0, 3),
    }
  })
})
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB')
}
</script>
