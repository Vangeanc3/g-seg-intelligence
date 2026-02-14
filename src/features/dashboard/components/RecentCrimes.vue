<template>
  <BaseCard>
    <template #header>
      <h3>Últimas Ocorrências</h3>
    </template>
    <div class="table-container">
      <table class="crimes-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Data/Hora</th>
            <th>Local</th>
            <th>Status</th>
            <th>Prioridade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="crime in crimes" :key="crime.id">
            <td>
              <span class="crime-type">{{ crime.type }}</span>
            </td>
            <td class="date-cell">{{ crime.date }}</td>
            <td class="location-cell">{{ crime.location }}</td>
            <td>
              <span class="status-badge" :class="`status-${crime.status}`">
                {{ getStatusLabel(crime.status) }}
              </span>
            </td>
            <td>
              <span class="priority-badge" :class="`priority-${crime.priority}`">
                {{ getPriorityLabel(crime.priority) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '@/shared/components/BaseCard.vue'
import type { RecentCrime } from '../types/dashboard'

interface Props {
  crimes: RecentCrime[]
}

defineProps<Props>()

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    aberto: 'Aberto',
    em_investigacao: 'Em Investigação',
    solucionado: 'Solucionado'
  }
  return labels[status] || status
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta'
  }
  return labels[priority] || priority
}
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
  font-weight: 500;
}

.date-cell {
  color: #94a3b8;
}

.location-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge,
.priority-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-aberto {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}

.status-em_investigacao {
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
}

.status-solucionado {
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
}

.priority-baixa {
  background: rgba(148, 163, 184, 0.1);
  color: #cbd5e1;
}

.priority-media {
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
}

.priority-alta {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}
</style>
