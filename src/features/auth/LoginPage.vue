<template>
  <div class="login-card">
    <h2>Entrar</h2>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="seu@email.com"
          required
        />
      </div>

      <div class="form-group">
        <label>Senha</label>
        <input
          v-model="senha"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" class="btn-login">
        Entrar
      </button>
    </form>

    <p class="register-link">
      Não tem conta?
      <router-link to="/auth/registro">Criar conta</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const senha = ref('')

async function handleLogin() {
  try {
    localStorage.setItem('auth_token', 'fake-token-123')

    router.push('/dashboard')
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    alert('Erro ao fazer login')
  }
}
</script>

<style scoped>
.login-card {
  background: #1e293b;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #334155;
}

h2 {
  margin: 0 0 1.5rem;
  color: white;
  font-size: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
}

input::placeholder {
  color: #64748b;
}

.btn-login {
  width: 100%;
  padding: 0.875rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
}

.btn-login:hover {
  background: #2563eb;
}

.register-link {
  margin-top: 1.5rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
}

.register-link a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
