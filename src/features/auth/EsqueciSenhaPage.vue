<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <div class="auth-logo">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#3b82f6"/>
            <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#60a5fa"/>
          </svg>
        </div>
        <h1 class="auth-title">G-SEG Intelligence</h1>
      </div>

      <!-- Estado 1: Formulário -->
      <BaseCard v-if="!enviado" variant="bordered">
        <template #header>
          <h2>Recuperar Senha</h2>
        </template>

        <p class="form-descricao">
          Digite seu email e enviaremos um link para redefinir sua senha.
        </p>

        <form @submit.prevent="handleEnviar">
          <div class="form-fields">
            <BaseInput
              v-model="email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              :error="erro"
              required
            />
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            :loading="loading"
            full-width
          >
            Enviar Link de Recuperação
          </BaseButton>
        </form>

        <template #footer>
          <p class="auth-footer-text">
            Lembrou a senha?
            <router-link to="/auth/login" class="auth-link">Voltar ao login</router-link>
          </p>
        </template>
      </BaseCard>

      <!-- Estado 2: Confirmação -->
      <BaseCard v-else variant="bordered">
        <div class="confirmacao">
          <div class="confirmacao-icon">
            <i class="mdi mdi-email-check"></i>
          </div>
          <h2 class="confirmacao-titulo">Email enviado!</h2>
          <p class="confirmacao-desc">
            Enviamos um link de recuperação para
            <strong>{{ email }}</strong>.
            Verifique sua caixa de entrada e spam.
          </p>
          <p class="confirmacao-nota">
            O link expira em 30 minutos.
          </p>

          <div class="confirmacao-actions">
            <BaseButton
              variant="primary"
              full-width
              @click="reenviar"
              :loading="loading"
            >
              Reenviar Email
            </BaseButton>
            <router-link to="/auth/login" class="btn-voltar">
              <i class="mdi mdi-arrow-left"></i>
              Voltar ao Login
            </router-link>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseCard from '@/shared/components/BaseCard.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import { isValidEmail } from '@/shared/utils/validators'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()

const email = ref('')
const erro = ref('')
const loading = ref(false)
const enviado = ref(false)

async function handleEnviar() {
  erro.value = ''

  if (!email.value) {
    erro.value = 'Email é obrigatório'
    return
  }
  if (!isValidEmail(email.value)) {
    erro.value = 'Email inválido'
    return
  }

  loading.value = true
  try {
    // Simular envio de email
    await new Promise(resolve => setTimeout(resolve, 1200))
    enviado.value = true
  } catch {
    erro.value = 'Erro ao enviar. Tente novamente.'
  } finally {
    loading.value = false
  }
}

async function reenviar() {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Email reenviado com sucesso!')
  } catch {
    toast.error('Erro ao reenviar.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 16px;
  margin-bottom: 1rem;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}

h2 {
  margin: 0;
  font-size: 1.125rem;
  color: #e2e8f0;
}

.form-descricao {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 1.25rem;
}

.form-fields {
  margin-bottom: 1.25rem;
}

.auth-footer-text {
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}

.auth-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

/* Confirmação */
.confirmacao {
  text-align: center;
  padding: 1rem 0;
}

.confirmacao-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.25rem;
}

.confirmacao-titulo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.75rem;
}

.confirmacao-desc {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 0.5rem;
}

.confirmacao-desc strong {
  color: #e2e8f0;
}

.confirmacao-nota {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 1.5rem;
}

.confirmacao-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-voltar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  color: #94a3b8;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s;
}

.btn-voltar:hover {
  color: #e2e8f0;
}
</style>
