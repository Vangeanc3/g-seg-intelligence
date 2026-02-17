<template>
  <BaseCard variant="bordered">
        <template #header>
          <h2>Registro</h2>
        </template>

        <form @submit.prevent="handleRegistro">
          <div class="form-fields">
            <BaseInput
              v-model="nome"
              label="Nome completo"
              placeholder="Seu nome"
              :error="errors.nome"
              required
            />

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
              placeholder="Mínimo 8 caracteres"
              :error="errors.senha"
              required
            />

            <BaseInput
              v-model="confirmarSenha"
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              :error="errors.confirmarSenha"
              required
            />
          </div>

          <ErrorMessage v-if="erroGeral" :message="erroGeral" />

          <BaseButton
            type="submit"
            variant="primary"
            :loading="loading"
            full-width
          >
            Criar conta
          </BaseButton>
        </form>

        <template #footer>
          <p class="auth-footer-text">
            Já tem conta?
            <router-link to="/auth/login" class="auth-link">Entrar</router-link>
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
import { isValidEmail, isStrongPassword } from '@/shared/utils/validators'

const router = useRouter()

const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const loading = ref(false)
const erroGeral = ref('')
const errors = reactive({ nome: '', email: '', senha: '', confirmarSenha: '' })

function validar(): boolean {
  errors.nome = ''
  errors.email = ''
  errors.senha = ''
  errors.confirmarSenha = ''
  erroGeral.value = ''

  if (!nome.value.trim()) {
    errors.nome = 'Nome é obrigatório'
    return false
  }
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
  if (!isStrongPassword(senha.value)) {
    errors.senha = 'Senha deve ter 8+ caracteres, maiúscula, minúscula, número e especial'
    return false
  }
  if (senha.value !== confirmarSenha.value) {
    errors.confirmarSenha = 'Senhas não coincidem'
    return false
  }
  return true
}

async function handleRegistro() {
  if (!validar()) return

  loading.value = true
  erroGeral.value = ''

  try {
    // Simular chamada API (substituir por authService real depois)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Registro mockado — redireciona pro login
    router.push('/login')
  } catch (e) {
    erroGeral.value = 'Erro ao criar conta. Tente novamente.'
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
</style>
