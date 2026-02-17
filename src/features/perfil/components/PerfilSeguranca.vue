<template>
  <div class="form-section">
    <h2 class="section-titulo">Segurança</h2>

    <form @submit.prevent="onSubmit" class="perfil-form">
      <div class="form-stack">
        <div class="form-grupo">
          <label class="form-label">Senha atual</label>
          <input type="password" class="form-input" v-model="senhaAtual" placeholder="Digite sua senha atual" />
          <span v-if="erro" class="form-erro">{{ erro }}</span>
        </div>

        <div class="form-grupo">
          <label class="form-label">Nova senha</label>
          <input type="password" class="form-input" v-model="novaSenha" placeholder="Mínimo 8 caracteres" />
        </div>

        <div class="form-grupo">
          <label class="form-label">Confirmar nova senha</label>
          <input type="password" class="form-input" v-model="confirmar" placeholder="Repita a nova senha" />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-salvar" :disabled="salvando">
          <i v-if="salvando" class="mdi mdi-loading mdi-spin"></i>
          <i v-else class="mdi mdi-lock-reset"></i>
          {{ salvando ? 'Alterando...' : 'Alterar Senha' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  salvando: boolean
}>()

const emit = defineEmits<{
  alterarSenha: [senhaAtual: string, novaSenha: string]
}>()

const senhaAtual = ref('')
const novaSenha = ref('')
const confirmar = ref('')
const erro = ref('')

function onSubmit() {
  erro.value = ''

  if (!senhaAtual.value) {
    erro.value = 'Senha atual é obrigatória'
    return
  }
  if (novaSenha.value.length < 8) {
    erro.value = 'Nova senha deve ter no mínimo 8 caracteres'
    return
  }
  if (novaSenha.value !== confirmar.value) {
    erro.value = 'As senhas não coincidem'
    return
  }

  emit('alterarSenha', senhaAtual.value, novaSenha.value)

  // Limpar campos após sucesso
  senhaAtual.value = ''
  novaSenha.value = ''
  confirmar.value = ''
}
</script>

<style scoped>
.form-section {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 1.75rem;
}

.section-titulo {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 1.25rem;
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.form-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.form-input {
  padding: 0.625rem 0.75rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-erro {
  font-size: 0.75rem;
  color: #ef4444;
}

.form-actions {
  margin-top: 1.5rem;
}

.btn-salvar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-salvar:hover:not(:disabled) {
  background: #2563eb;
}

.btn-salvar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
