<template>
  <div class="empty-state">
    <div class="empty-icon" :style="{ background: cor + '10', color: cor }">
      <i :class="icone"></i>
    </div>
    <h3 class="empty-titulo">{{ titulo }}</h3>
    <p class="empty-desc">{{ descricao }}</p>
    <slot name="acao"></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  titulo: string
  descricao: string
  icone?: string
  cor?: string
}>(), {
  icone: 'mdi mdi-magnify-close',
  cor: '#3b82f6',
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
  min-height: 200px;
}

.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1.25rem;
}

.empty-titulo {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.375rem;
}

.empty-desc {
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
  max-width: 320px;
}
</style>
