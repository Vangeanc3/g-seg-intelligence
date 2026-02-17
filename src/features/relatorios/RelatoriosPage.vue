<template>
  <div class="relatorios-page">
    <div class="relatorios-header">
      <h1 class="page-title">Relatórios</h1>
      <p class="page-subtitle">Gere relatórios de segurança personalizados para exportação</p>
    </div>

    <!-- Estado 1: Configuração -->
    <RelatorioConfig
      v-if="!gerado"
      :config="config"
      :bairros-disponiveis="bairrosDisponiveis"
      :total-filtrado="crimesFiltrados.length"
      @gerar="gerarRelatorio"
    />

    <!-- Estado 2: Preview + Ações -->
    <template v-else>
      <RelatorioAcoes
        @voltar="voltarConfig"
        @exportar-csv="exportarCsv"
        @exportar-pdf="exportarPdf"
      />
      <RelatorioPreview
        :config="config"
        :resumo="resumo"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import RelatorioConfig from './components/RelatorioConfig.vue'
import RelatorioPreview from './components/RelatorioPreview.vue'
import RelatorioAcoes from './components/RelatorioAcoes.vue'
import { useRelatorio } from './composables/useRelatorio'

const {
  config,
  gerado,
  crimesFiltrados,
  resumo,
  bairrosDisponiveis,
  gerarRelatorio,
  voltarConfig,
  exportarCsv,
  exportarPdf,
} = useRelatorio()
</script>

<style scoped>
.relatorios-page {
  padding: 1.5rem;
  max-width: 1000px;
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
  .relatorios-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.25rem;
  }
}
</style>
