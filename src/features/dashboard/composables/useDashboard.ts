import { ref, computed } from 'vue'
import type {
  DashboardStats,
  CrimeByDate,
  CrimeByType,
  RecentCrime
} from '../types/dashboard'

export function useDashboard() {
  const loading = ref(false)
  const dateFilter = ref<string>('30d')

  // Stats mockados
  const stats = ref<DashboardStats>({
    totalCrimes: 1247,
    solvedCases: 623,
    investigating: 412,
    resolutionRate: 49.9,
    changePercent: {
      totalCrimes: 12,
      solvedCases: 8,
      investigating: 0,
      resolutionRate: 2.3
    }
  })

  // Dados para gráfico de linha (últimos 30 dias)
  const crimesByDate = ref<CrimeByDate[]>([
    { date: '2026-01-15', count: 42 },
    { date: '2026-01-16', count: 38 },
    { date: '2026-01-17', count: 45 },
    { date: '2026-01-18', count: 51 },
    { date: '2026-01-19', count: 39 },
    { date: '2026-01-20', count: 47 },
    { date: '2026-01-21', count: 43 },
    { date: '2026-01-22', count: 49 },
    { date: '2026-01-23', count: 52 },
    { date: '2026-01-24', count: 44 },
    { date: '2026-01-25', count: 41 },
    { date: '2026-01-26', count: 38 },
    { date: '2026-01-27', count: 46 },
    { date: '2026-01-28', count: 50 },
    { date: '2026-01-29', count: 48 },
    { date: '2026-01-30', count: 45 }
  ])

  // Dados para gráfico de pizza (tipos de crime)
  const crimesByType = ref<CrimeByType[]>([
    { type: 'Roubo', count: 487, percentage: 39, color: '#ef4444' },
    { type: 'Furto', count: 374, percentage: 30, color: '#f59e0b' },
    { type: 'Agressão', count: 186, percentage: 15, color: '#ec4899' },
    { type: 'Tráfico', count: 124, percentage: 10, color: '#8b5cf6' },
    { type: 'Outros', count: 76, percentage: 6, color: '#6b7280' }
  ])

  // Últimas ocorrências
  const recentCrimes = ref<RecentCrime[]>([
    {
      id: '1',
      type: 'Roubo',
      date: '2026-02-13 14:30',
      location: 'Av. Nazaré, Umarizal',
      status: 'em_investigacao',
      priority: 'alta'
    },
    {
      id: '2',
      type: 'Furto',
      date: '2026-02-13 12:15',
      location: 'Travessa Padre Eutíquio, Batista Campos',
      status: 'aberto',
      priority: 'media'
    },
    {
      id: '3',
      type: 'Agressão',
      date: '2026-02-13 09:45',
      location: 'Rua João Diogo, Cidade Velha',
      status: 'solucionado',
      priority: 'baixa'
    },
    {
      id: '4',
      type: 'Tráfico',
      date: '2026-02-12 23:20',
      location: 'Av. Pedro Miranda, Pedreira',
      status: 'em_investigacao',
      priority: 'alta'
    },
    {
      id: '5',
      type: 'Roubo',
      date: '2026-02-12 18:00',
      location: 'Av. Governador José Malcher, Nazaré',
      status: 'aberto',
      priority: 'media'
    }
  ])

  function updateDateFilter(filter: string) {
    dateFilter.value = filter
    // Aqui vai buscar novos dados quando conectar API
    console.log('Filtro atualizado:', filter)
  }

  return {
    loading,
    dateFilter,
    stats,
    crimesByDate,
    crimesByType,
    recentCrimes,
    updateDateFilter
  }
}
