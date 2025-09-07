<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div
      v-if="errors"
      class="p-4 absolute top-5 mx-5 bg-red-900/50 border border-red-700 rounded-lg backdrop-blur-sm"
    >
      <div class="flex items-center justify-between gap-4">
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
    <form
      class="bg-gray-900 text-white rounded-lg w-full md:w-3/4 lg:1/2 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <div class="flex flex-col p-3 border-b border-gray-700">
        <div class="flex items-center gap-3 mb-4 px-1">
          <h3 class="font-semibold flex-1 min-w-30 truncate">{{ workoutSession.templateName }}</h3>
          <input
            type="date"
            v-model="workoutSession.date"
            class="bg-gray-800 border border-gray-600 rounded text-white px-2 py-1 text-sm flex-1 min-w-10 max-w-35"
          />
        </div>

        <select
          v-model="selectedTemplate"
          @focus="getUserTemplates"
          @change="handleTemplateChange($event)"
          class="w-full bg-gray-800 border border-gray-600 rounded text-white p-2 text-sm mb-2"
        >
          <option value="">No Template (Custom)</option>
          <option v-for="template in workoutTemplates" :key="template.id" :value="template.name">
            {{ template.name }}
          </option>
        </select>

        <textarea
          v-model="workoutSession.notes"
          placeholder="Workout notes..."
          class="w-full bg-gray-800 border border-gray-600 rounded text-white p-2 text-sm resize-none placeholder-gray-500"
          rows="1"
        ></textarea>
      </div>

      <div class="overflow-y-auto overflow-x-hidden p-3 max-w-full">
        <div class="space-y-3">
          <div
            v-for="(exercise, exerciseIndex) in exercises"
            :key="exerciseIndex"
            class="bg-gray-800 rounded-lg p-3"
          >
            <div
              class="grid grid-cols-[1.7rem_1fr_1rem] md:grid-cols-[2.5rem_1fr_1rem] gap-1.5 items-center py-1 mb-2"
            >
              <input
                required
                type="number"
                v-model.number="exercise.exercise_order"
                class="text-center text-3xl ml-2 font-medium exercise-order-input"
                @keydown.enter="handleOrderChange(exerciseIndex)"
                @blur="handleOrderChange(exerciseIndex)"
              />

              <input
                required
                type="text"
                id="exercise"
                v-model="exercise.name"
                placeholder="Exercise name"
                :tabindex="exerciseIndex * 100 + 1"
                @keydown.enter="focusNext"
                class="bg-gray-700 border border-gray-600 rounded text-white px-2 py-1 text-sm flex-1"
              />

              <button
                type="button"
                @click="removeExercise(exerciseIndex)"
                class="text-red-400 hover:bg-gray-700 rounded cursor-pointer text-xl w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div class="mt-2">
              <div
                class="grid grid-cols-[1rem_3rem_2rem_2rem_1fr_1rem] md:grid-cols-[2rem_4rem_2.5rem_2.5rem_1fr_2.5rem] gap-1.5 pb-1 border-b border-gray-600 mb-1 text-xs font-medium text-gray-400"
              >
                <div class="ml-1">SET</div>
                <div class="ml-2">KG</div>
                <div>REPS</div>
                <div>RIR</div>
                <div>NOTES</div>
              </div>

              <div
                v-for="(set, setIndex) in exercise.sets"
                :key="setIndex"
                class="grid grid-cols-[1rem_2rem_0.5rem_2rem_2rem_1fr_1rem] md:grid-cols-[2rem_3rem_0.5rem_2.5rem_2.5rem_1fr_1rem] gap-1.5 items-center py-1"
              >
                <div class="text-center text-sm font-medium">{{ set.set_number }}</div>

                <input
                  type="number"
                  v-model.number="set.weight"
                  placeholder="0"
                  @keydown.enter="focusNext"
                  :tabindex="exerciseIndex * 100 + setIndex * 10 + 2"
                  class="bg-gray-700 border border-gray-600 rounded text-white px-1 py-1 w-full text-center text-xs"
                  step="0.5"
                  min="0"
                />

                <div class="text-center text-xs text-gray-400">x</div>

                <input
                  type="number"
                  :tabindex="exerciseIndex * 100 + setIndex * 10 + 3"
                  v-model.number="set.reps"
                  placeholder="0"
                  @keydown.enter="focusNext"
                  class="bg-gray-700 border border-gray-600 rounded text-white px-1 py-1 w-full text-center text-xs"
                  min="0"
                />

                <input
                  type="number"
                  :tabindex="exerciseIndex * 100 + setIndex * 10 + 4"
                  v-model.number="set.rir"
                  placeholder="0"
                  @keydown.enter="focusNext"
                  class="bg-gray-700 border border-gray-600 rounded text-white px-1 py-1 w-full text-center text-xs"
                  min="0"
                  max="10"
                />

                <textarea
                  v-model="set.notes"
                  placeholder="Notes..."
                  @keydown.enter="focusNext"
                  class="bg-gray-700 border workoutInput border-gray-600 rounded text-white px-2 py-1 text-xs resize-none w-full focus:w-[80vw] focus:mx-auto focus:h-20 focus:text-sm focus:fixed focus:inset-x-4 focus:top-1/2 focus:transform focus:-translate-y-1/2 focus:z-50 md:focus:w-full md:focus:h-auto md:focus:text-xs md:focus:static md:focus:inset-auto md:focus:top-auto md:focus:transform-none md:focus:translate-y-0 md:focus:z-auto"
                  rows="1"
                />

                <button
                  type="button"
                  @click="removeSet(exerciseIndex, setIndex)"
                  class="text-red-400 hover:bg-gray-700 rounded cursor-pointer text-xl w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <button
                type="button"
                @click="addSet(exerciseIndex)"
                class="w-full border border-dashed border-gray-600 rounded cursor-pointer text-gray-400 py-2 text-xs mt-2 hover:border-gray-500 hover:text-gray-300 transition-all"
              >
                Add Set
              </button>
            </div>
          </div>

          <button
            type="button"
            @click="addExercise"
            class="w-full bg-red-600 hover:bg-red-700 cursor-pointer rounded-lg text-white py-2 text-sm font-medium transition-colors"
          >
            + Add Exercise
          </button>
        </div>
      </div>
      <div class="flex gap-3 p-3 border-t border-gray-700">
        <button
          type="button"
          class="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white py-2 text-sm font-medium transition-colors"
          @click="saveWorkout"
        >
          Save Workout
        </button>
        <button
          type="button"
          @click="cancelWorkout"
          class="border border-gray-600 hover:border-gray-500 cursor-pointer hover:bg-gray-800 rounded-lg text-white py-2 px-4 text-sm transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { createWorkoutSession } from '@/api/workoutSession'
import { getAllWorkoutTemplates } from '@/api/workoutTemplate'
import { ref, nextTick, onMounted, defineEmits } from 'vue'
const emit = defineEmits(['close', 'addSession'])

const exercises = ref([])
const errors = ref('')

const workoutTemplates = ref([])
const selectedTemplate = ref('')

const workoutSession = ref({
  date: new Date().toISOString(),
  templateName: 'Untitled',
  notes: '',
  templateGuid: null,
})

const focusNext = (event) => {
  const currentTabIndex = parseInt(event.target.tabIndex)
  const allInputs = Array.from(document.querySelectorAll('input[tabindex]')).sort(
    (a, b) => parseInt(a.tabIndex) - parseInt(b.tabIndex),
  )

  const currentIndex = allInputs.findIndex((input) => parseInt(input.tabIndex) === currentTabIndex)
  if (currentIndex !== -1 && currentIndex < allInputs.length - 1) {
    allInputs[currentIndex + 1].focus()
  }
}

onMounted(async () => {
  await nextTick()
  if (exercises.value.length > 0) {
    const firstInput1 = document.querySelector('#exercise')
    firstInput1.focus()
  }
})

const createNewSet = (setNumber) => {
  return {
    set_number: setNumber,
    weight: null,
    reps: null,
    rir: null,
    notes: '',
  }
}

const createNewExercise = (name = '', order) => {
  return {
    name,
    exercise_order: order || 1,
    notes: null,
    sets: [createNewSet(1)],
  }
}
const handleTemplateChange = async () => {
  if (selectedTemplate.value) {
    const template = workoutTemplates.value.find((t) => t.name === selectedTemplate.value)

    workoutSession.value.templateName = template.name
    workoutSession.value.templateGuid = template.templateGuid

    exercises.value = template.TemplateExercises.map((ex) =>
      createNewExercise(ex.name, ex.exercise_order),
    )
  } else {
    exercises.value = []
    workoutSession.value.templateName = 'Untitled'
    workoutSession.value.templateGuid = null
    exercises.value = [createNewExercise()]
  }
}

const addSet = (exerciseIndex) => {
  const lastSet = exercises.value[exerciseIndex].sets.length
  exercises.value[exerciseIndex].sets.push(createNewSet(lastSet + 1))
}
const removeSet = (exerciseIndex, setIndex) => {
  exercises.value[exerciseIndex].sets.splice(setIndex, 1)
  updateSetOrder(exerciseIndex)
}
const addExercise = () => {
  const index = exercises.value?.length + 1 || 0
  exercises.value.push(createNewExercise(null, index))
}

const removeExercise = (index) => {
  exercises.value.splice(index, 1)
  updateExerciseOrderOnRemove()
}
const updateExerciseOrderOnRemove = () => {
  exercises.value.forEach((exercise, index) => {
    exercise.exercise_order = index + 1
  })
}
const updateSetOrder = (exerciseIndex) => {
  exercises.value[exerciseIndex].sets.forEach((set, index) => {
    set.set_number = index + 1
  })
}

const handleOrderChange = (exerciseIndex) => {
  updateExerciseOrderOnChange(exerciseIndex, exercises.value[exerciseIndex].exercise_order)
}
const updateExerciseOrderOnChange = (exerciseIndex, newOrder) => {
  const totalExercises = exercises.value.length

  const targetOrder = parseInt(newOrder)
  if (isNaN(targetOrder) || targetOrder < 1 || targetOrder > totalExercises) {
    alert(`Please enter a valid order between 1 and ${totalExercises}`)
    exercises.value[exerciseIndex].exercise_order = exerciseIndex + 1
    return
  }
  const currentOrder = exerciseIndex + 1

  if (currentOrder === targetOrder) {
    return
  }
  const exerciseToMove = exercises.value[exerciseIndex]

  exercises.value.splice(exerciseIndex, 1)

  exercises.value.splice(targetOrder - 1, 0, exerciseToMove)

  exercises.value.forEach((exercise, index) => {
    exercise.exercise_order = index + 1
  })
}
const cancelWorkout = () => {
  if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
    resetForm()

    emit('close')
  }
}
const resetForm = () => {
  workoutSession.value = {
    date: new Date().toISOString(),
    templateGuid: null,
    templateName: 'Untitled',
    notes: '',
  }
  exercises.value = []
  selectedTemplate.value = ''
}

const getUserTemplates = async () => {
  const templates = await getAllWorkoutTemplates()
  workoutTemplates.value = templates
}

const saveWorkout = async () => {
  try {
    await createWorkoutSession({
      session: workoutSession.value,
      exercises: exercises.value,
    })
    emit('addSession')
    emit('close')
  } catch (err) {
    console.log(err)
    errors.value = err.response?.data?.message || 'Something went wrong'
  }
}

onMounted(() => {
  addExercise()
})
</script>
