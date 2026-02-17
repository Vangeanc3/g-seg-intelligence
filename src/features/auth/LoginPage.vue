<template>
  <BaseCard variant="bordered">
        <template #header>
          <h2>Entrar</h2>
        </template>

        <form @submit.prevent="handleLogin">
          <div class="form-fields">
            <BaseInput
              v-model="email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              :error="errors.email"
              required
            />

            <BaseInput
              v-model="senha"
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              :error="errors.senha"
              required
            />
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="lembrar" />
              <span>Lembrar de mim</span>
            </label>
            <router-link to="/auth/esqueci-senha" class="forgot-link">Esqueceu a senha?</router-link>
          </div>

          <ErrorMessage v-if="erroGeral" :message="erroGeral" />

          <BaseButton
            type="submit"
            variant="primary"
            :loading="loading"
            full-width
          >
            Entrar
          </BaseButton>
        </form>

        <template #footer>
          <p class="auth-footer-text">
            Não tem conta?
            <router-link to="/auth/registro" class="auth-link">Criar conta</router-link>
          </p>
        </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseCard from '@/shared/components/BaseCard.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import ErrorMessage from '@/shared/components/ErrorMessage.vue'
import { isValidEmail } from '@/shared/utils/validators'
import { useToast } from '@/shared/composables/useToast'

const router = useRouter()
const toast = useToast()

const email = ref('')
const senha = ref('')
const lembrar = ref(false)
const loading = ref(false)
const erroGeral = ref('')
const errors = reactive({ email: '', senha: '' })

function validar(): boolean {
  errors.email = ''
  errors.senha = ''
  erroGeral.value = ''

  if (!email.value) {
    errors.email = 'Email é obrigatório'
    return false
  }
  if (!isValidEmail(email.value)) {
    errors.email = 'Email inválido'
    return false
  }
  if (!senha.value) {
    errors.senha = 'Senha é obrigatória'
    return false
  }
  if (senha.value.length < 6) {
    errors.senha = 'Senha deve ter no mínimo 6 caracteres'
    return false
  }
  return true
}

async function handleLogin() {
  if (!validar()) return

  loading.value = true
  erroGeral.value = ''

  try {
    // Simular chamada API (substituir por authService real depois)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Login mockado — aceita qualquer email/senha válidos
    // Usar a mesma chave que o authService verifica
    localStorage.setItem('auth_token', 'mock-token')
    localStorage.setItem('user_data', JSON.stringify({
      id: '1',
      nome: 'Usuário Demo',
      email: email.value,
      role: 'admin'
    }))

    toast.success('Login realizado com sucesso!')
    router.push('/app/dashboard')
  } catch (e) {
    erroGeral.value = 'Erro ao fazer login. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
h2 {
  margin: 0;
  font-size: 1.125rem;
  color: #e2e8f0;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.8125rem;
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  accent-color: #3b82f6;
}

.forgot-link {
  color: #3b82f6;
  font-size: 0.8125rem;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
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
</style>
