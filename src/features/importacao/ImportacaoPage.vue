<template>
  <div class="importacao-page">
    <div class="page-header">
      <h1>Importação de Dados</h1>
      <p>Faça upload de planilhas da SEGUP para importar ocorrências ao sistema.</p>
    </div>

    <!-- Zona de upload -->
    <div
      class="upload-zone"
      :class="{ dragover: arrastando, uploading }"
      @dragover.prevent="arrastando = true"
      @dragleave.prevent="arrastando = false"
      @drop.prevent="onDrop"
      @click="selecionarArquivo"
    >
      <input
        ref="inputFile"
        type="file"
        accept=".xlsx,.xls"
        hidden
        @change="onFileChange"
      />

      <template v-if="!uploading && !resultado">
        <div class="upload-icon">
          <i class="mdi mdi-cloud-upload-outline"></i>
        </div>
        <h3 class="upload-titulo">Arraste a planilha aqui</h3>
        <p class="upload-desc">ou clique para selecionar um arquivo</p>
        <span class="upload-formatos">Formatos aceitos: .xlsx, .xls</span>
      </template>

      <template v-else-if="uploading">
        <div class="upload-icon uploading-icon">
          <i class="mdi mdi-loading mdi-spin"></i>
        </div>
        <h3 class="upload-titulo">Enviando arquivo...</h3>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progresso + '%' }"></div>
        </div>
        <span class="upload-desc">{{ progresso }}%</span>
      </template>
    </div>

    <!-- Resultado -->
    <transition name="fade">
      <div v-if="resultado" class="resultado-box">
        <div class="resultado-header">
          <i class="mdi mdi-check-circle"></i>
          <h3>Importação concluída</h3>
        </div>

        <div class="resultado-stats">
          <div class="stat-item">
            <span class="stat-label">Total de Registros</span>
            <AnimatedNumber :valor="resultado.total" class="stat-valor" />
          </div>
          <div class="stat-item success">
            <span class="stat-label">Importados</span>
            <AnimatedNumber :valor="resultado.importados" class="stat-valor" />
          </div>
          <div class="stat-item warning">
            <span class="stat-label">Duplicados</span>
            <AnimatedNumber :valor="resultado.duplicados" class="stat-valor" />
          </div>
          <div class="stat-item error">
            <span class="stat-label">Erros</span>
            <AnimatedNumber :valor="resultado.erros" class="stat-valor" />
          </div>
        </div>

        <div class="resultado-actions">
          <button class="btn-secondary" @click="resetar">
            <i class="mdi mdi-upload"></i>
            Nova Importação
          </button>
          <router-link to="/app/mapa" class="btn-primary">
            Ver no Mapa
            <i class="mdi mdi-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </transition>

    <div class="historico-section">
      <ImportacaoHistorico
        :importacoes="historico"
        :carregando="carregandoHistorico"
        @recarregar="carregarHistorico"
      />
    </div>

    <!-- Info box -->
    <div class="info-box">
      <i class="mdi mdi-information-outline"></i>
      <div>
        <strong>Formato esperado:</strong>
        Planilha Excel com colunas: Natureza, Categoria, Data do Fato, Hora do Fato, Bairro,
        Latitude, Longitude, Meio Empregado, Sexo Vítima, Idade Vítima.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ImportacaoHistorico from './components/ImportacaoHistorico.vue'
import {
  importacaoService,
  type ImportacaoItem,
  type ImportacaoResultado,
} from './services/importacaoService'
import { useToast } from '@/shared/composables/useToast'
import AnimatedNumber from '@/shared/components/AnimatedNumber.vue'

const toast = useToast()
const inputFile = ref<HTMLInputElement | null>(null)
const arrastando = ref(false)
const uploading = ref(false)
const progresso = ref(0)
const resultado = ref<ImportacaoResultado | null>(null)
const historico = ref<ImportacaoItem[]>([])
const carregandoHistorico = ref(false)

async function carregarHistorico() {
  carregandoHistorico.value = true

  try {
    historico.value = await importacaoService.listar()
  } catch {
    historico.value = []
  } finally {
    carregandoHistorico.value = false
  }
}

function selecionarArquivo() {
  if (!uploading.value) inputFile.value?.click()
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) enviarArquivo(file)
}

function onDrop(e: DragEvent) {
  arrastando.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) enviarArquivo(file)
}

async function enviarArquivo(file: File) {
  if (!/\.(xlsx|xls)$/i.test(file.name)) {
    toast.error('Formato inválido. Envie um arquivo .xlsx ou .xls')
    return
  }

  uploading.value = true
  progresso.value = 0
  resultado.value = null

  try {
    const res = await importacaoService.upload(file, (pct) => {
      progresso.value = pct
    })
    resultado.value = res
    toast.success(`${res.importados} registros importados com sucesso`)
    await carregarHistorico()
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    toast.error(axiosErr.response?.data?.message || 'Erro ao enviar arquivo')
  } finally {
    uploading.value = false
  }
}

function resetar() {
  resultado.value = null
  progresso.value = 0
  if (inputFile.value) inputFile.value.value = ''
}

onMounted(() => {
  void carregarHistorico()
})
</script>

<style scoped>
.importacao-page {
  padding: 1.5rem;
  max-width: 800px;
}

.page-header h1 {
  font-size: 1.5rem;
  color: #e2e8f0;
  margin: 0 0 0.25rem;
}

.page-header p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 2rem;
}

/* Upload zone */
.upload-zone {
  border: 2px dashed #334155;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  background: #1e293b;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-zone:hover,
.upload-zone.dragover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.upload-zone.uploading {
  cursor: default;
  border-color: #3b82f6;
}

.upload-icon {
  font-size: 3rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.upload-titulo {
  font-size: 1.125rem;
  color: #e2e8f0;
  margin: 0 0 0.375rem;
}

.upload-desc {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.25rem;
}

.upload-formatos {
  font-size: 0.75rem;
  color: #475569;
}

/* Progress */
.progress-bar {
  width: 300px;
  max-width: 100%;
  height: 6px;
  background: #0f172a;
  border-radius: 6px;
  margin: 1rem auto 0.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transition: width 0.3s;
}

/* Resultado */
.resultado-box {
  margin-top: 2rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 1.75rem;
}

.resultado-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.5rem;
}

.resultado-header i {
  font-size: 1.5rem;
  color: #22c55e;
}

.resultado-header h3 {
  font-size: 1.0625rem;
  color: #e2e8f0;
  margin: 0;
}

.resultado-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  background: #0f172a;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #334155;
}

.stat-label {
  display: block;
  font-size: 0.6875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.375rem;
}

.stat-valor {
  font-size: 1.75rem;
  font-weight: 700;
  color: #e2e8f0;
}

.stat-item.success { border-color: rgba(34, 197, 94, 0.3); }
.stat-item.success .stat-valor { color: #22c55e; }
.stat-item.warning { border-color: rgba(245, 158, 11, 0.3); }
.stat-item.warning .stat-valor { color: #f59e0b; }
.stat-item.error { border-color: rgba(239, 68, 68, 0.3); }
.stat-item.error .stat-valor { color: #ef4444; }

.resultado-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover { background: #2563eb; }

.btn-secondary {
  background: transparent;
  border: 1px solid #334155;
  color: #94a3b8;
}

.btn-secondary:hover {
  border-color: #94a3b8;
  color: #e2e8f0;
}

.historico-section {
  margin-top: 2rem;
}

/* Info box */
.info-box {
  margin-top: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 10px;
  font-size: 0.8125rem;
  color: #94a3b8;
  line-height: 1.5;
}

.info-box i {
  color: #3b82f6;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.info-box strong { color: #e2e8f0; }

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to { opacity: 0; }

@media (max-width: 600px) {
  .resultado-stats { grid-template-columns: repeat(2, 1fr); }
  .resultado-actions { flex-direction: column; }
}
</style>
