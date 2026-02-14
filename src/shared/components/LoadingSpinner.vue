<template>
  <div :class="spinnerClasses">
    <div class="spinner"></div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullscreen: false
})

const spinnerClasses = computed(() => [
  'loading-spinner',
  `loading-spinner--${props.size}`,
  {
    'loading-spinner--fullscreen': props.fullscreen
  }
])
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.loading-spinner--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  z-index: 9999;
}

.spinner {
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner--sm .spinner {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.loading-spinner--md .spinner {
  width: 40px;
  height: 40px;
}

.loading-spinner--lg .spinner {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

.loading-text {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}

.loading-spinner--fullscreen .loading-text {
  color: #e2e8f0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
