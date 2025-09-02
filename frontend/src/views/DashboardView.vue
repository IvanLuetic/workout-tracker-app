<template>
  <div v-if="isSessionModalOpen">
    <sessionModal @close="isSessionModalOpen = false"> </sessionModal>
  </div>
  <div v-if="isTemplateModalOpen">
    <templateModal @close="isTemplateModalOpen = false"> </templateModal>
  </div>
  <WorkoutsDashboard
    @open-add-session-modal="isSessionModalOpen = true"
    @open-add-template-modal="isTemplateModalOpen = true"
    :workouts="workouts"
  ></WorkoutsDashboard>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import sessionModal from '@/components/sessionModal.vue'
import templateModal from '@/components/templateModal.vue'
import WorkoutsDashboard from '@/components/WorkoutsDashboard.vue'
import { getWorkoutSessions } from '@/api/workoutSession'

const isSessionModalOpen = ref(false)
const isTemplateModalOpen = ref(false)

const workouts = ref([])
const fetchSessions = async () => {
  workouts.value = await getWorkoutSessions()
}
onMounted(() => {
  fetchSessions()
})
</script>

<style scoped>
/* Optional: Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 8px;
  background: #1a1a1a;
}
::-webkit-scrollbar-thumb {
  background: #b91c1c;
  border-radius: 4px;
}
</style>
