<template></template>

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  sessionId: {
    type: String,
    required: true,
  },
})
</script>
