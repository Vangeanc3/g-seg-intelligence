<template>
  <div class="base-input">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      @input="handleInput"
    />

    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

const inputClasses = computed(() => [
  'input-field',
  {
    'input-field--error': props.error,
    'input-field--disabled': props.disabled
  }
])

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e2e8f0;
}

.required {
  color: #ef4444;
}

.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  font-size: 1rem;
  color: #e2e8f0;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field::placeholder {
  color: #64748b;
}

.input-field--error {
  border-color: #ef4444;
}

.input-field--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-field--disabled {
  background: #1e293b;
  cursor: not-allowed;
  opacity: 0.6;
}

.error-message {
  font-size: 0.875rem;
  color: #ef4444;
}
</style>
