import { ref, computed } from 'vue'
import type { Usuario } from '../types/perfil'
import { useToast } from '@/shared/composables/useToast'

const STORAGE_KEY = 'g-seg-perfil'

// Dados mockados iniciais
const dadosPadrao: Usuario = {
  nome: 'Ismael Silva',
  email: 'ismael@gseg.com.br',
  telefone: '(91) 98765-4321',
  empresa: 'G-SEG Intelligence',
  cargo: 'Administrador',
  plano: 'profissional',
  criadoEm: '2026-01-15',
}

export function usePerfil() {
  const toast = useToast()

  // Carregar do localStorage ou usar padrão
  const carregarUsuario = (): Usuario => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) {
      try { return JSON.parse(salvo) } catch { /* ignora */ }
    }
    return { ...dadosPadrao }
  }

  const usuario = ref<Usuario>(carregarUsuario())
  const salvando = ref(false)

  // Iniciais pro avatar
  const iniciais = computed(() => {
    return usuario.value.nome
      .split(' ')
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  })

  // Label do plano
  const planoLabel = computed(() => {
    const labels: Record<string, string> = {
      basico: 'Básico',
      profissional: 'Profissional',
      enterprise: 'Enterprise',
    }
    return labels[usuario.value.plano] || usuario.value.plano
  })

  // Cor do plano
  const planoCor = computed(() => {
    const cores: Record<string, string> = {
      basico: '#94a3b8',
      profissional: '#3b82f6',
      enterprise: '#8b5cf6',
    }
    return cores[usuario.value.plano] || '#94a3b8'
  })

  // Membro desde
  const membroDesde = computed(() => {
    return new Date(usuario.value.criadoEm).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
  })

  // Salvar perfil
  async function salvarPerfil() {
    salvando.value = true
    try {
      // Simular API
      await new Promise(resolve => setTimeout(resolve, 800))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario.value))
      toast.success('Perfil atualizado com sucesso!')
    } catch {
      toast.error('Erro ao salvar perfil.')
    } finally {
      salvando.value = false
    }
  }

  // Alterar senha (mockado)
  async function alterarSenha(senhaAtual: string, novaSenha: string): Promise<boolean> {
    salvando.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      // Mockado: qualquer senha atual funciona
      toast.success('Senha alterada com sucesso!')
      return true
    } catch {
      toast.error('Erro ao alterar senha.')
      return false
    } finally {
      salvando.value = false
    }
  }

  return {
    usuario,
    salvando,
    iniciais,
    planoLabel,
    planoCor,
    membroDesde,
    salvarPerfil,
    alterarSenha,
  }
}
