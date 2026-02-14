<template>
  <div class="date-filter">
    <button
      v-for="option in options"
      :key="option.value"
      :class="['filter-button', { active: modelValue === option.value }]"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface FilterOption {
  value: string
  label: string
}

interface Props {
  modelValue: string
}

defineProps<Props>()
defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const options: FilterOption[] = [
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' }
]
</script>

<style scoped>
.date-filter {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-button {
  padding: 0.5rem 1rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-button:hover {
  background: #334155;
  color: #e2e8f0;
}

.filter-button.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}
</style>
