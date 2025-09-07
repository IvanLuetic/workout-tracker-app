<template>
  <div v-if="isSessionModalOpen">
    <sessionModal @close="isSessionModalOpen = false" @addSession="handleAddSession()">
    </sessionModal>
  </div>
  <div v-if="isTemplateModalOpen">
    <templateModal @close="isTemplateModalOpen = false"> </templateModal>
  </div>
  <WorkoutsDashboard
    ref="dashboardComponent"
    @open-add-session-modal="isSessionModalOpen = true"
    @open-add-template-modal="isTemplateModalOpen = true"
  ></WorkoutsDashboard>
</template>

<script setup>
import { ref } from 'vue'

import sessionModal from '@/components/SessionModal.vue'
import templateModal from '@/components/TemplateModal.vue'
import WorkoutsDashboard from '@/components/WorkoutsDashboard.vue'

const dashboardComponent = ref(null)

const updateSessions = () => {
  dashboardComponent.value.fetchSessions()
}
const handleAddSession = () => {
  updateSessions()
}
const isSessionModalOpen = ref(false)
const isTemplateModalOpen = ref(false)
</script>
