<template>
  <div class="perfil-header">
    <div class="avatar" :style="{ background: planoCor + '20', color: planoCor }">
      {{ iniciais }}
    </div>
    <div class="header-info">
      <h1 class="header-nome">{{ usuario.nome }}</h1>
      <p class="header-cargo">{{ usuario.cargo }} — {{ usuario.empresa }}</p>
      <div class="header-meta">
        <span class="plano-badge" :style="{ background: planoCor + '20', color: planoCor, border: '1px solid ' + planoCor + '40' }">
          <i class="mdi mdi-shield-star"></i>
          Plano {{ planoLabel }}
        </span>
        <span class="membro-desde">
          <i class="mdi mdi-calendar"></i>
          Membro desde {{ membroDesde }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Usuario } from '../types/perfil'

defineProps<{
  usuario: Usuario
  iniciais: string
  planoLabel: string
  planoCor: string
  membroDesde: string
}>()
</script>

<style scoped>
.perfil-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.header-nome {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}

.header-cargo {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.plano-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.membro-desde {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #64748b;
}

@media (max-width: 600px) {
  .perfil-header {
    flex-direction: column;
    text-align: center;
  }
  .header-meta {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
