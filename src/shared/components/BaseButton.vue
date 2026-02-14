<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner"></span>
    <slot v-else></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  fullWidth: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--disabled': props.disabled,
    'base-button--loading': props.loading,
    'base-button--full-width': props.fullWidth
  }
])

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

/* Variants */
.base-button--primary {
  background: #3b82f6;
  color: white;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background: #2563eb;
}

.base-button--secondary {
  background: #1e293b;
  color: #e2e8f0;
  border: 1px solid #334155;
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background: #334155;
}

.base-button--danger {
  background: #ef4444;
  color: white;
}

.base-button--danger:hover:not(.base-button--disabled) {
  background: #dc2626;
}

.base-button--ghost {
  background: transparent;
  color: #3b82f6;
}

.base-button--ghost:hover:not(.base-button--disabled) {
  background: rgba(59, 130, 246, 0.1);
}

/* Sizes */
.base-button--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.base-button--md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.base-button--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

/* States */
.base-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button--full-width {
  width: 100%;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
