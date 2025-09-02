<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <form
      class="bg-gray-900 text-white rounded-lg w-full md:w-3/4 lg:1/2 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div class="flex flex-col p-3 border-b border-gray-700">
        <div class="flex items-center gap-3 mb-4 px-1">
          <h3 class="font-semibold flex-1 min-w-30 truncate">{{ workoutSession.name }}</h3>
          <input
            type="date"
            v-model="workoutSession.workout_date"
            class="bg-gray-800 border border-gray-600 rounded text-white px-2 py-1 text-sm flex-1 min-w-10 max-w-35"
          />
        </div>

        <!-- Template Selection -->
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

        <!-- Session Notes -->
        <textarea
          v-model="workoutSession.notes"
          placeholder="Workout notes..."
          class="w-full bg-gray-800 border border-gray-600 rounded text-white p-2 text-sm resize-none placeholder-gray-500"
          rows="1"
        ></textarea>
      </div>

      <!-- Exercises -->
      <div class="overflow-y-auto overflow-x-hidden p-3 max-w-full">
        <div class="space-y-3">
          <div
            v-for="(exercise, exerciseIndex) in exercises"
            :key="exerciseIndex"
            class="bg-gray-800 rounded-lg p-3"
          >
            <!-- Exercise Header -->
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
                :ref="(el) => setInputRef(el, exerciseIndex, 'exercise', 'name')"
                type="text"
                v-model="exercise.name"
                placeholder="Exercise name"
                @keydown.enter="focusNext(exerciseIndex, 'exercise', 'name')"
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
            <!-- Sets -->
            <div class="mt-2">
              <!-- Header -->
              <div
                class="grid grid-cols-[1rem_3rem_2rem_2rem_1fr_1rem] md:grid-cols-[2rem_4rem_2.5rem_2.5rem_1fr_2.5rem] gap-1.5 pb-1 border-b border-gray-600 mb-1 text-xs font-medium text-gray-400"
              >
                <div class="ml-1">SET</div>
                <div class="ml-2">KG</div>
                <div>REPS</div>
                <div>RIR</div>
                <div>NOTES</div>
              </div>

              <!-- Sets -->
              <div
                v-for="(set, setIndex) in exercise.sets"
                :key="setIndex"
                class="grid grid-cols-[1rem_2rem_0.5rem_2rem_2rem_1fr_1rem] md:grid-cols-[2rem_3rem_0.5rem_2.5rem_2.5rem_1fr_1rem] gap-1.5 items-center py-1"
              >
                <div class="text-center text-sm font-medium">{{ set.set_number }}</div>

                <!-- Weight  -->
                <input
                  type="number"
                  :ref="(el) => setInputRef(el, exerciseIndex, setIndex, 'weight')"
                  v-model.number="set.weight"
                  placeholder="0"
                  @keydown.enter="focusNext(exerciseIndex, setIndex, 'weight')"
                  class="bg-gray-700 border border-gray-600 rounded text-white px-1 py-1 w-full text-center text-xs"
                  step="0.5"
                  min="0"
                />

                <div class="text-center text-xs text-gray-400">x</div>

                <!-- Reps  -->
                <input
                  type="number"
                  :ref="(el) => setInputRef(el, exerciseIndex, setIndex, 'reps')"
                  v-model.number="set.reps"
                  placeholder="0"
                  @keydown.enter="focusNext(exerciseIndex, setIndex, 'reps')"
                  class="bg-gray-700 border border-gray-600 rounded text-white px-1 py-1 w-full text-center text-xs"
                  min="0"
                />

                <!-- RIR  -->
                <input
                  type="number"
                  :ref="(el) => setInputRef(el, exerciseIndex, setIndex, 'rir')"
                  v-model.number="set.rir"
                  placeholder="0"
                  @keydown.enter="focusNext(exerciseIndex, setIndex, 'rir')"
                  class="bg-gray-700 border border-gray-600 rounded text-white px-1 py-1 w-full text-center text-xs"
                  min="0"
                  max="10"
                />

                <!-- Notes  -->
                <textarea
                  :ref="(el) => setInputRef(el, exerciseIndex, setIndex, 'notes')"
                  v-model="set.notes"
                  placeholder="Notes..."
                  @keydown.enter="focusNext(exerciseIndex, setIndex, 'notes')"
                  class="bg-gray-700 border workoutInput border-gray-600 rounded text-white px-2 py-1 text-xs resize-none w-full focus:w-[80vw] focus:mx-auto focus:h-20 focus:text-sm focus:fixed focus:inset-x-4 focus:top-1/2 focus:transform focus:-translate-y-1/2 focus:z-50 md:focus:w-full md:focus:h-auto md:focus:text-xs md:focus:static md:focus:inset-auto md:focus:top-auto md:focus:transform-none md:focus:translate-y-0 md:focus:z-auto"
                  rows="1"
                />

                <!-- Remove Set Button -->
                <button
                  type="button"
                  @click="removeSet(exerciseIndex, setIndex)"
                  class="text-red-400 hover:bg-gray-700 rounded cursor-pointer text-xl w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <!-- Add Set Button -->
              <button
                type="button"
                @click="addSet(exerciseIndex)"
                class="w-full border border-dashed border-gray-600 rounded cursor-pointer text-gray-400 py-2 text-xs mt-2 hover:border-gray-500 hover:text-gray-300 transition-all"
              >
                Add Set
              </button>
            </div>
          </div>

          <!-- Add Exercise Button -->
          <button
            type="button"
            @click="addExercise"
            class="w-full bg-red-600 hover:bg-red-700 cursor-pointer rounded-lg text-white py-2 text-sm font-medium transition-colors"
          >
            + Add Exercise
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
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
const emit = defineEmits(['close'])

const inputRefs = ref({})

const exercises = ref([])

const workoutTemplates = ref([])
const selectedTemplate = ref('')
// Set input reference with organized structure
const setInputRef = (el, exerciseIndex, setIndex, type) => {
  if (el) {
    if (!inputRefs.value[exerciseIndex]) {
      inputRefs.value[exerciseIndex] = {}
    }
    if (!inputRefs.value[exerciseIndex][setIndex]) {
      inputRefs.value[exerciseIndex][setIndex] = {}
    }
    inputRefs.value[exerciseIndex][setIndex][type] = el
  }
}

const getNextInput = (exerciseIndex, setIndex, currentType) => {
  const typeOrder = ['name', 'weight', 'reps', 'rir', 'notes']
  const currentTypeIndex = typeOrder.indexOf(currentType)

  // If it's the exercise name, go to first set's weight
  if (currentType === 'name') {
    return inputRefs.value[exerciseIndex]?.[0]?.['weight']
  }

  // If it's the last field of a set (notes), go to next set's weight
  if (currentType === 'notes') {
    const nextSetIndex = setIndex + 1
    const currentExercise = exercises.value[exerciseIndex]

    // If there's a next set in current exercise
    if (nextSetIndex < currentExercise.sets.length) {
      return inputRefs.value[exerciseIndex]?.[nextSetIndex]?.['weight']
    }

    // If no more sets, go to next exercise's name
    const nextExerciseIndex = exerciseIndex + 1
    if (nextExerciseIndex < exercises.value.length) {
      return inputRefs.value[nextExerciseIndex]?.['exercise']?.['name']
    }

    // No more inputs
    return null
  }

  // Move to next field in same set
  const nextTypeIndex = currentTypeIndex + 1
  if (nextTypeIndex < typeOrder.length) {
    const nextType = typeOrder[nextTypeIndex]
    return inputRefs.value[exerciseIndex]?.[setIndex]?.[nextType]
  }

  return null
}

// Focus the next input
const focusNext = (exerciseIndex, setIndex, currentType) => {
  const nextInput = getNextInput(exerciseIndex, setIndex, currentType)
  if (nextInput) {
    nextInput.focus()
  }
}

// Focus first input on mount
onMounted(async () => {
  await nextTick()
  if (exercises.value.length > 0) {
    const firstInput = inputRefs.value[0]?.['exercise']?.['name']
    if (!firstInput.value) {
      firstInput.focus()
    }
  }
})

const workoutSession = ref({
  date: new Date().toISOString().split('T')[0],
  templateName: 'Untitled',
  notes: '',
  templateGuid: null,
})

const createNewSet = (setNumber) => {
  return {
    set_number: setNumber,
    weight: 0,
    reps: 0,
    rir: 0,
    notes: '',
  }
}

const createNewExercise = (name = '', index) => {
  return {
    name,
    exercise_order: index,
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
  const index = exercises.value?.length || 0
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
  // At this point, v-model has already updated exercise.exercise_order
  // with the user's input, so we can use it directly
  updateExerciseOrderOnChange(exerciseIndex, exercises.value[exerciseIndex].exercise_order)
}
const updateExerciseOrderOnChange = (exerciseIndex, newOrder) => {
  const totalExercises = exercises.value.length

  // Validate input
  const targetOrder = parseInt(newOrder)
  if (isNaN(targetOrder) || targetOrder < 1 || targetOrder > totalExercises) {
    alert(`Please enter a valid order between 1 and ${totalExercises}`)
    // Reset to current array position + 1 (since we display 1-based)
    exercises.value[exerciseIndex].exercise_order = exerciseIndex + 1
    return
  }

  // Current position in 1-based terms
  const currentOrder = exerciseIndex + 1

  // No change needed
  if (currentOrder === targetOrder) {
    return
  }
  const exerciseToMove = exercises.value[exerciseIndex]

  // Remove from current position
  exercises.value.splice(exerciseIndex, 1)

  // Insert at new position (targetOrder - 1 because splice uses 0-based indexing)
  exercises.value.splice(targetOrder - 1, 0, exerciseToMove)

  // Update ALL exercise_order values to match new array positions
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
const saveWorkout = async () => {
  await createWorkoutSession({
    session: workoutSession.value,
    exercises: exercises.value,
  })
  emit('close')
}
const resetForm = () => {
  workoutSession.value = {
    templateGuid: null,
    workout_date: new Date().toISOString().split('T')[0],
    templateName: 'Untitled',
    notes: '',
  }
  exercises.value = []
  selectedTemplate.value = ''
}

const loadTemplate = (template) => {
  if (template && template.exercises) {
    workoutSession.value.name = template.name
    workoutSession.value.template_id = template.id

    exercises.value = template.exercises.map((ex, index) => ({
      name: ex.name,
      exercise_order: index + 1,
      sets: Array(ex.target_sets || 3)
        .fill()
        .map((_, setIndex) => createNewSet(setIndex + 1)),
    }))
  }
}

const getUserTemplates = async () => {
  const templates = await getAllWorkoutTemplates()
  workoutTemplates.value = templates
}

// Lifecycle
onMounted(() => {
  // Add first exercise by default
  addExercise()
})

// Expose methods that might be called by parent component
defineExpose({
  loadTemplate,
  resetForm,
})
</script>
