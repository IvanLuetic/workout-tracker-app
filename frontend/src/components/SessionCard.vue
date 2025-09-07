<template>
  <div
    v-bind:displayWorkout
    class="rounded-xl h-54 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 shadow-xl border border-gray-700 hover:border-red-500/50 hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
    @click="openSessionView(displayWorkout)"
  >
    <div class="px-5 py-3">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-red-400 group-hover:text-red-300 transition-colors">
          {{ displayWorkout.templateName }}
        </h3>
        <span class="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
          {{ displayWorkout.display_date }}
        </span>
      </div>

      <div class="mb-3">
        <div class="flex items-center gap-4 text-sm text-gray-300">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
            {{ displayWorkout.SessionExercises.length }} exercises
          </span>
        </div>
      </div>

      <ul class="space-y-1">
        <li
          v-for="(exercise, idx) in displayWorkout.exercises"
          :key="idx"
          class="flex items-center gap-2 text-sm text-gray-300"
        >
          <span class="inline-block w-1.5 h-1.5 bg-red-400 rounded-full opacity-60"></span>
          {{ exercise.name }}
        </li>
      </ul>

      <div v-if="displayWorkout.SessionExercises.length > 3" class="mt-2 text-xs text-gray-500">
        +{{ displayWorkout.SessionExercises.length - 3 }} more exercises
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, ref } from 'vue'

const emit = defineEmits(['openSessionView'])
const { workout } = defineProps({
  workout: {
    type: Object,
    required: true,
  },
})

const selectedWorkout = ref({})

const displayWorkout = computed(() => {
  return {
    ...workout,
    display_date: formatDate(workout.date),
    exercises: workout.SessionExercises.slice(0, 3),
  }
})
const openSessionView = (workout) => {
  selectedWorkout.value = workout
  emit('openSessionView', selectedWorkout.value)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB')
}
</script>
