<template>
  <div class="perfil-page">
    <div class="perfil-page-header">
      <h1 class="page-title">Meu Perfil</h1>
      <p class="page-subtitle">Gerencie suas informações pessoais e configurações</p>
    </div>

    <PerfilHeader
      :usuario="usuario"
      :iniciais="iniciais"
      :plano-label="planoLabel"
      :plano-cor="planoCor"
      :membro-desde="membroDesde"
    />

    <PerfilInfoForm
      :usuario="usuario"
      :plano-label="planoLabel"
      :salvando="salvando"
      @salvar="salvarPerfil"
    />

    <PerfilSeguranca
      :salvando="salvando"
      @alterar-senha="alterarSenha"
    />
  </div>
</template>

<script setup lang="ts">
import PerfilHeader from './components/PerfilHeader.vue'
import PerfilInfoForm from './components/PerfilInfoForm.vue'
import PerfilSeguranca from './components/PerfilSeguranca.vue'
import { usePerfil } from './composables/usePerfil'

const {
  usuario,
  salvando,
  iniciais,
  planoLabel,
  planoCor,
  membroDesde,
  salvarPerfil,
  alterarSenha,
} = usePerfil()
</script>

<style scoped>
.perfil-page {
  padding: 1.5rem;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

@media (max-width: 768px) {
  .perfil-page {
    padding: 1rem;
  }
}
</style>
