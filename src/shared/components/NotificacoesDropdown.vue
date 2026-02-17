<template>
  <div class="notificacoes-wrapper">
    <!-- Botão sino -->
    <button class="notif-btn" @click="toggle">
      <i class="mdi mdi-bell-outline"></i>
      <span v-if="naoLidas > 0" class="notif-badge">{{ naoLidas }}</span>
    </button>

    <!-- Dropdown -->
    <transition name="dropdown">
      <div v-if="aberto" class="notif-dropdown">
        <div class="notif-header">
          <h3 class="notif-titulo">Notificações</h3>
          <button v-if="naoLidas > 0" class="notif-marcar-todas" @click="marcarTodasLidas">
            Marcar todas como lidas
          </button>
        </div>

        <div class="notif-lista" v-if="notificacoes.length > 0">
          <div
            v-for="n in notificacoes"
            :key="n.id"
            class="notif-item"
            :class="{ 'nao-lida': !n.lida }"
            @click="marcarLida(n.id)"
          >
            <div class="notif-item-icon" :class="n.tipo">
              <i :class="icone(n.tipo)"></i>
            </div>
            <div class="notif-item-content">
              <span class="notif-item-titulo">{{ n.titulo }}</span>
              <span class="notif-item-msg">{{ n.mensagem }}</span>
              <span class="notif-item-tempo">{{ tempoRelativo(n.criadoEm) }}</span>
            </div>
            <div v-if="!n.lida" class="notif-dot"></div>
          </div>
        </div>

        <div v-else class="notif-vazio">
          <i class="mdi mdi-bell-check-outline"></i>
          <span>Nenhuma notificação</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getNotificacoes, type Notificacao } from '../data/mockNotificacoes'

const notificacoes = ref<Notificacao[]>(getNotificacoes())
const aberto = ref(false)

const naoLidas = computed(() => notificacoes.value.filter(n => !n.lida).length)

function toggle() {
  aberto.value = !aberto.value
}

function marcarLida(id: number) {
  const n = notificacoes.value.find(n => n.id === id)
  if (n) n.lida = true
}

function marcarTodasLidas() {
  notificacoes.value.forEach(n => { n.lida = true })
}

function icone(tipo: string): string {
  const icones: Record<string, string> = {
    crime: 'mdi mdi-alert-circle',
    sistema: 'mdi mdi-cog',
    relatorio: 'mdi mdi-file-chart',
    alerta: 'mdi mdi-shield-alert',
  }
  return icones[tipo] || 'mdi mdi-bell'
}

function tempoRelativo(data: string): string {
  const diff = Date.now() - new Date(data).getTime()
  const minutos = Math.floor(diff / 60000)
  if (minutos < 1) return 'Agora mesmo'
  if (minutos < 60) return `${minutos}min atrás`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `${horas}h atrás`
  const dias = Math.floor(horas / 24)
  return `${dias}d atrás`
}

// Fechar ao clicar fora
function onClickOutside(e: Event) {
  const el = e.target as HTMLElement
  if (!el.closest('.notificacoes-wrapper')) {
    aberto.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.notificacoes-wrapper {
  position: relative;
}

.notif-btn {
  position: relative;
  background: transparent;
  border: 1px solid transparent;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.notif-btn:hover {
  color: #e2e8f0;
  background: rgba(59, 130, 246, 0.1);
}

.notif-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1e293b;
}

.notif-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 380px;
  max-height: 480px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  z-index: 200;
}

.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #334155;
  flex-shrink: 0;
}

.notif-titulo {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.notif-marcar-todas {
  background: transparent;
  border: none;
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.notif-marcar-todas:hover {
  text-decoration: underline;
}

.notif-lista {
  overflow-y: auto;
  flex: 1;
}

.notif-lista::-webkit-scrollbar {
  width: 4px;
}

.notif-lista::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid rgba(51, 65, 85, 0.4);
}

.notif-item:hover {
  background: rgba(59, 130, 246, 0.05);
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-item.nao-lida {
  background: rgba(59, 130, 246, 0.05);
}

.notif-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.notif-item-icon.crime {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.notif-item-icon.alerta {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.notif-item-icon.relatorio {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.notif-item-icon.sistema {
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
}

.notif-item-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
}

.notif-item-titulo {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #e2e8f0;
}

.notif-item-msg {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-item-tempo {
  font-size: 0.6875rem;
  color: #475569;
  margin-top: 0.125rem;
}

.notif-dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.375rem;
}

.notif-vazio {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.notif-vazio i {
  font-size: 2rem;
  color: #475569;
}

/* Animação dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Mobile */
@media (max-width: 480px) {
  .notif-dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 70vh;
    border-radius: 16px 16px 0 0;
  }
}
</style>
