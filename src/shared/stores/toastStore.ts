import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastTipo = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  mensagem: string
  tipo: ToastTipo
  duracao: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let nextId = 0

  function adicionar(mensagem: string, tipo: ToastTipo = 'info', duracao = 3000) {
    const id = nextId++
    toasts.value.push({ id, mensagem, tipo, duracao })

    // Auto-remover
    setTimeout(() => remover(id), duracao)
  }

  function remover(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, adicionar, remover }
})
