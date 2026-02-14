<template>
  <div :class="messageClasses">
    <i :class="iconClass" class="message-icon"></i>
    <div class="message-content">
      <slot>{{ message }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  message?: string
  variant?: 'error' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'error'
})

const messageClasses = computed(() => [
  'error-message',
  `error-message--${props.variant}`
])

const iconClass = computed(() => {
  const icons = {
    error: 'mdi mdi-alert-circle',
    warning: 'mdi mdi-alert',
    info: 'mdi mdi-information'
  }
  return icons[props.variant]
})
</script>

<style scoped>
.error-message {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.error-message--error {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #fca5a5;
}

.error-message--warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
  color: #fbbf24;
}

.error-message--info {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  color: #93c5fd;
}

.message-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
}
</style>
