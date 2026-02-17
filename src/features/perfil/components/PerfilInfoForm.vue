<template>
  <div class="form-section">
    <h2 class="section-titulo">Informações Pessoais</h2>

    <form @submit.prevent="$emit('salvar')" class="perfil-form">
      <div class="form-grid">
        <div class="form-grupo">
          <label class="form-label">Nome completo</label>
          <input type="text" class="form-input" v-model="usuario.nome" />
        </div>

        <div class="form-grupo">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" v-model="usuario.email" />
        </div>

        <div class="form-grupo">
          <label class="form-label">Telefone</label>
          <input type="tel" class="form-input" v-model="usuario.telefone" placeholder="(91) 99999-9999" />
        </div>

        <div class="form-grupo">
          <label class="form-label">Empresa</label>
          <input type="text" class="form-input" v-model="usuario.empresa" />
        </div>

        <div class="form-grupo">
          <label class="form-label">Cargo</label>
          <input type="text" class="form-input" v-model="usuario.cargo" />
        </div>

        <div class="form-grupo">
          <label class="form-label">Plano</label>
          <div class="form-input readonly">
            {{ planoLabel }}
            <a href="/#planos" class="upgrade-link">Alterar plano</a>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-salvar" :disabled="salvando">
          <i v-if="salvando" class="mdi mdi-loading mdi-spin"></i>
          <i v-else class="mdi mdi-check"></i>
          {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Usuario } from '../types/perfil'

defineProps<{
  usuario: Usuario
  planoLabel: string
  salvando: boolean
}>()

defineEmits<{ salvar: [] }>()
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.form-input.readonly {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.5);
  color: #94a3b8;
  cursor: default;
}

.upgrade-link {
  font-size: 0.75rem;
  color: #3b82f6;
  text-decoration: none;
}

.upgrade-link:hover {
  text-decoration: underline;
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
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

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
