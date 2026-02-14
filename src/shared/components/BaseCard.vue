<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>

    <div class="card-body">
      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'bordered' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md'
})

const cardClasses = computed(() => [
  'base-card',
  `base-card--${props.variant}`,
  `base-card--padding-${props.padding}`
])
</script>

<style scoped>
.base-card {
  background: #1e293b;
  border-radius: 8px;
  overflow: hidden;
}

.base-card--default {
  border: 1px solid #334155;
}

.base-card--bordered {
  border: 2px solid #3b82f6;
}

.base-card--elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
              0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.card-header {
  padding: 1rem;
  border-bottom: 1px solid #334155;
  font-weight: 600;
  color: #e2e8f0;
}

.card-body {
  color: #e2e8f0;
}

.base-card--padding-none .card-body {
  padding: 0;
}

.base-card--padding-sm .card-body {
  padding: 0.5rem;
}

.base-card--padding-md .card-body {
  padding: 1rem;
}

.base-card--padding-lg .card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem;
  border-top: 1px solid #334155;
  background: #0f172a;
  color: #94a3b8;
}
</style>
