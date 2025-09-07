<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div
      class="bg-gradient-to-br flex flex-col from-gray-900 via-gray-800 to-gray-700 rounded-2xl shadow-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden"
    >
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <div>
          <h2 class="text-2xl font-bold text-white">{{ workout.templateName }}</h2>
          <p class="text-gray-400 text-sm mt-1 max-w-4/5 sm:max-w-full">
            {{ formatDate(workout.date) }}
          </p>
        </div>
        <button
          @click="$emit('closeSessionView')"
          class="text-gray-400 cursor-pointer hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="p-5 overflow-y-auto">
        <div
          v-if="workout.notes"
          class="mb-6 p-2 px-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
        >
          <h5 class="text-blue-400 mb-2">Session Notes</h5>
          <p class="text-gray-300">{{ workout.notes }}</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(exercise, index) in workout.SessionExercises"
            :key="index"
            class="bg-gray-800/50 rounded-xl px-4 border border-gray-700"
          >
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-red-400 mb-2">
                {{ exercise.name }}
              </h3>
              <span class="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                Exercise {{ exercise.exercise_number }}
              </span>
            </div>

            <div
              v-if="exercise.notes"
              class="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20"
            >
              <p class="text-yellow-400 text-sm font-medium mb-1">Exercise Notes:</p>
              <p class="text-gray-300 text-sm">{{ exercise.notes }}</p>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="text-left py-2 px-3 text-gray-400 font-medium">Set</th>
                    <th class="text-center py-2 px-3 text-gray-400 font-medium">Weight</th>
                    <th class="text-center py-2 px-3 text-gray-400 font-medium">Reps</th>
                    <th class="text-center py-2 px-3 text-gray-400 font-medium">RIR</th>
                    <th class="text-left py-2 px-3 text-gray-400 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="set in exercise.SessionSets"
                    :key="set.set_number"
                    class="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                  >
                    <td class="py-3 px-3">
                      <span
                        class="inline-flex items-center justify-center w-8 h-8 bg-red-500/20 text-red-400 rounded-full text-sm font-bold"
                      >
                        {{ set.set_number }}
                      </span>
                    </td>
                    <td class="py-3 px-3 text-center text-white font-medium">
                      {{ set.weight }} kg
                    </td>
                    <td class="py-3 px-3 text-center text-white font-medium">
                      {{ set.reps || '-' }}
                    </td>
                    <td class="py-3 px-3 text-center">
                      <span class="px-2 py-1 rounded text-sm font-medium">
                        {{ set.rir }}
                      </span>
                    </td>
                    <td class="py-3 px-3 text-gray-300 text-sm">
                      {{ set.notes || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 border-t flex justify-end items-center border-gray-700 bg-gray-900/50">
        <button
          @click="handleDeleteSession(workout.sessionGuid)"
          class="px-6 py-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { deleteSession } from '@/api/workoutSession'

const emit = defineEmits(['closeSessionView', 'deleteSession'])

const props = defineProps({
  workout: {
    type: Object,
    required: true,
  },
})

const formatDate = (dateString) => {
  console.log(props.workout)
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleDeleteSession = async (id) => {
  await deleteSession(id)
  emit('deleteSession')
  emit('closeSessionView')
}
</script>
