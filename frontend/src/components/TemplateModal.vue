<template>
  <div
    v-if="message"
    class="absolute inset-0 pointer-events-none flex items-start justify-center z-100"
  >
    <h3 class="text-red-400 font-bold z-100">
      {{ message }}
    </h3>
  </div>

  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div class="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl cursor-pointer"
        @click="closeAddTemplateModal"
        aria-label="Close"
      >
        &times;
      </button>
      <h3 class="text-2xl text-center font-bold text-red-400 mb-6">Add Exercises to Template</h3>
      <div class="mb-4">
        <label class="block text-gray-300 mb-2" for="templateName">Template Name</label>
        <input
          ref="templateNameInput"
          id="templateName"
          autocomplete="off"
          v-model="templateName"
          type="text"
          class="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500"
          placeholder="e.g. Upper Body"
          required
        />
      </div>

      <form @submit.prevent="addExercise">
        <div class="mb-4">
          <label class="block text-gray-300 mb-2" for="exerciseName">Exercise Name</label>
          <input
            ref="templateExerciseInput"
            id="templateInput"
            autocomplete="off"
            v-model="newExercise.name"
            type="text"
            class="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500"
            placeholder="e.g. Bench Press"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 rounded bg-red-500 hover:bg-red-600 text-white font-bold transition-colors cursor-pointer"
        >
          Add Exercise
        </button>
      </form>
      <ul class="mt-6 space-y-2">
        <li
          v-for="(exercise, index) in templateExercises"
          :key="index"
          class="flex items-center justify-between bg-gray-800 px-4 py-2 rounded"
        >
          <span class="text-gray-200">{{ exercise.name }}</span>
          <button
            @click="removeExercise(index)"
            class="text-red-400 hover:text-red-600 text- cursor-pointer"
            aria-label="Remove"
          >
            &times;
          </button>
        </li>
      </ul>
      <button
        class="mt-6 w-full py-2 rounded bg-green-500 hover:bg-green-600 text-white font-bold transition-colors cursor-pointer"
        @click="saveTemplate"
      >
        Save Template
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, defineEmits } from 'vue'
import { createWorkoutTemplate } from '@/api/workoutTemplate'

const emit = defineEmits(['close'])

const templateExerciseInput = ref(null)
const templateNameInput = ref(null)

const templateExercises = ref([])
const newExercise = ref({
  name: '',
  order: 0,
})
const templateName = ref('')
const message = ref('')

const addExercise = () => {
  const check = templateExercises.value.some(
    (exercise) => exercise.name.toLowerCase().trim() == newExercise.value.name.toLowerCase().trim(),
  )
  if (!check) {
    newExercise.value.order = newExercise.value.order + 1
    newExercise.value.name = newExercise.value.name.trim()
    templateExercises.value.push(newExercise.value)
    newExercise.value = { name: '', order: newExercise.value.order }
  } else {
    message.value = 'Exercise already included'
    setTimeout(() => {
      message.value = ''
    }, 2000)
  }
}
const removeExercise = (index) => {
  templateExercises.value.splice(index, 1)
}
const saveTemplate = async () => {
  if (!templateName.value.trim()) return (message.value = 'Please enter a name')
  if (!templateExercises.value.length) return (message.value = 'Please enter exercises')
  const data = {
    templateName: templateName.value,
    exercises: templateExercises.value,
  }
  try {
    const result = await createWorkoutTemplate(data)
    message.value = result.data.message
    templateExercises.value = []
    templateName.value = []
    emit('close')

    console.log(result.data.message)
  } catch (err) {
    console.error(err)
    message.value = err.response?.data.message
  }
}

const closeAddTemplateModal = async () => {
  if (templateExercises.value.length === 0) {
    emit('close')
  } else {
    if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      newExercise.value = { name: '', order: 0 }
      templateName.value = ''
      templateExercises.value = []
      emit('close')
    }
  }
}
watch(message, (val) => {
  if (val) {
    setTimeout(() => {
      message.value = null
    }, 2000)
  }
})

onMounted(async () => {
  await nextTick()
  templateNameInput.value.focus()
})
onMounted(() => {
  document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      if (document.activeElement === templateNameInput.value) {
        templateExerciseInput.value?.focus()
      }
    }
  })
})
onUnmounted(() => {
  document.removeEventListener('keypress', event)
})
</script>
