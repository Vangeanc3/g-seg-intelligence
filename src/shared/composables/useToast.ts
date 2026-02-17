import { useToastStore } from '../stores/toastStore'

export function useToast() {
  const store = useToastStore()

  return {
    success: (msg: string, duracao?: number) => store.adicionar(msg, 'success', duracao),
    error: (msg: string, duracao?: number) => store.adicionar(msg, 'error', duracao),
    warning: (msg: string, duracao?: number) => store.adicionar(msg, 'warning', duracao),
    info: (msg: string, duracao?: number) => store.adicionar(msg, 'info', duracao),
  }
}
