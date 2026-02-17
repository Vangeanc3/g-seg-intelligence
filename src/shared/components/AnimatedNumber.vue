<template>
  <span class="animated-number">{{ formatado }}</span>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useAnimatedNumber } from '../composables/useAnimatedNumber'

const props = withDefaults(defineProps<{
  valor: number
  duracao?: number
  formato?: 'numero' | 'decimal'
}>(), {
  duracao: 800,
  formato: 'numero',
})

const valorRef = toRef(props, 'valor')
const display = useAnimatedNumber(valorRef, props.duracao)

const formatado = computed(() => {
  if (props.formato === 'decimal') {
    return display.value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  }
  return display.value.toLocaleString('pt-BR')
})
</script>

<style scoped>
.animated-number {
  font-variant-numeric: tabular-nums;
}
</style>
