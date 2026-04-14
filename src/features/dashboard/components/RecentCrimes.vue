<template>
  <BaseCard>
    <template #header>
      <h3>Ultimas Ocorrencias</h3>
    </template>

    <div class="table-container">
      <table class="crimes-table">
        <thead>
          <tr>
            <th>Natureza</th>
            <th>Categoria</th>
            <th>Bairro</th>
            <th>Data</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="crime in crimes" :key="chaveCrime(crime)">
            <td>
              <span
                class="crime-type"
                :style="{ color: corNatureza(crime.properties.natureza) }"
              >
                {{ labelNatureza(crime.properties.natureza) }}
              </span>
            </td>
            <td class="category-cell">{{ crime.properties.categoria || '--' }}</td>
            <td class="bairro-cell">{{ crime.properties.bairro || '--' }}</td>
            <td class="date-cell">{{ formatarDataCrime(crime.properties.dataFato) }}</td>
            <td class="hour-cell">{{ formatarHoraCrime(crime.properties.horaFato) }}</td>
          </tr>
          <tr v-if="!crimes.length">
            <td colspan="5" class="empty-cell">
              Nenhuma ocorrencia encontrada para o periodo selecionado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '@/shared/components/BaseCard.vue'
import type { CrimesGeoJson } from '@/features/mapa-crimes/services/crimesService'
import {
  chaveCrime,
  corNatureza,
  formatarDataCrime,
  formatarHoraCrime,
  labelNatureza,
} from '@/features/mapa-crimes/types/crime'

defineProps<{
  crimes: CrimesGeoJson['features']
}>()
</script>

<style scoped>
h3 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1.125rem;
}

.table-container {
  overflow-x: auto;
}

.crimes-table {
  width: 100%;
  border-collapse: collapse;
}

.crimes-table thead {
  background: #0f172a;
}

.crimes-table th {
  padding: 0.75rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #334155;
}

.crimes-table td {
  padding: 1rem 0.75rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  border-bottom: 1px solid #334155;
}

.crimes-table tbody tr:hover {
  background: rgba(59, 130, 246, 0.05);
}

.crime-type {
  font-weight: 600;
}

.date-cell {
  color: #94a3b8;
}

.category-cell {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bairro-cell,
.hour-cell {
  color: #cbd5e1;
}

.empty-cell {
  text-align: center;
  color: #94a3b8;
}
</style>
