<template>
  <div class="historico-container">
    <div class="historico-header">
      <h3 class="historico-titulo">Histórico de Importações</h3>
      <button
        class="btn-refresh"
        :disabled="carregando"
        title="Atualizar"
        @click="$emit('recarregar')"
      >
        <i class="mdi mdi-refresh" :class="{ 'mdi-spin': carregando }"></i>
      </button>
    </div>

    <div v-if="carregando && importacoes.length === 0" class="historico-loading">
      <SkeletonLoader tipo="tabela" :linhas="3" />
    </div>

    <div v-else-if="importacoes.length > 0" class="historico-lista">
      <div
        v-for="item in importacoes"
        :key="item.id"
        class="historico-item"
      >
        <div class="item-info">
          <div class="item-arquivo">
            <i class="mdi mdi-file-excel"></i>
            <span class="arquivo-nome">{{ item.arquivo }}</span>
          </div>
          <span class="item-data">{{ formatarData(item.importadoEm) }}</span>
        </div>

        <div class="item-stats">
          <div class="stat" title="Total de registros">
            <i class="mdi mdi-file-document-outline"></i>
            <span>{{ item.total }}</span>
          </div>
          <div class="stat success" title="Importados com sucesso">
            <i class="mdi mdi-check-circle"></i>
            <span>{{ item.importados }}</span>
          </div>
          <div
            v-if="item.duplicados > 0"
            class="stat warning"
            title="Duplicados ignorados"
          >
            <i class="mdi mdi-content-copy"></i>
            <span>{{ item.duplicados }}</span>
          </div>
          <div v-if="item.erros > 0" class="stat error" title="Erros">
            <i class="mdi mdi-alert-circle"></i>
            <span>{{ item.erros }}</span>
          </div>
        </div>

        <button
          v-if="props.showDelete"
          class="btn-deletar"
          title="Remover importação e crimes associados"
          @click="confirmarDeletar(item)"
        >
          <i class="mdi mdi-trash-can-outline"></i>
        </button>
      </div>
    </div>

    <EmptyState
      v-else
      titulo="Nenhuma importação realizada"
      :descricao="
        props.showDelete
          ? 'Faça upload de uma planilha acima para começar.'
          : 'O histórico de importações aparecerá aqui quando houver registros.'
      "
      icone="mdi mdi-cloud-upload-outline"
      cor="#3b82f6"
    />

    <Teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="props.showDelete && deletando"
          class="modal-overlay"
          @click.self="fecharModal"
        >
          <div class="modal-box">
            <div class="modal-icon">
              <i class="mdi mdi-alert-circle"></i>
            </div>
            <h2 class="modal-titulo">Remover importação?</h2>
            <p class="modal-desc">
              Isso vai remover a importação
              <strong>{{ deletando.arquivo }}</strong>
              e todos os
              <strong>{{ deletando.importados }} crimes</strong>
              associados. Essa ação não pode ser desfeita.
            </p>
            <div class="modal-actions">
              <button class="btn-cancelar" @click="fecharModal">
                Cancelar
              </button>
              <button
                class="btn-confirmar-deletar"
                :disabled="processando"
                @click="executarDeletar"
              >
                <i v-if="processando" class="mdi mdi-loading mdi-spin"></i>
                <i v-else class="mdi mdi-trash-can-outline"></i>
                Remover
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/shared/composables/useToast'
import EmptyState from '@/shared/components/EmptyState.vue'
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue'
import {
  importacaoService,
  type ImportacaoItem,
} from '../services/importacaoService'

const props = withDefaults(defineProps<{
  importacoes: ImportacaoItem[]
  carregando: boolean
  showDelete?: boolean
}>(), {
  showDelete: false,
})

const emit = defineEmits<{
  recarregar: []
}>()

const toast = useToast()
const deletando = ref<ImportacaoItem | null>(null)
const processando = ref(false)

function formatarData(data: string): string {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function confirmarDeletar(item: ImportacaoItem) {
  if (!props.showDelete) return
  deletando.value = item
}

function fecharModal() {
  if (processando.value) return
  deletando.value = null
}

async function executarDeletar() {
  if (!props.showDelete || !deletando.value) return

  processando.value = true

  try {
    await importacaoService.deletar(deletando.value.id)
    toast.success(`Importação "${deletando.value.arquivo}" removida com sucesso`)
    deletando.value = null
    emit('recarregar')
  } catch {
    toast.error('Erro ao remover importação')
  } finally {
    processando.value = false
  }
}
</script>

<style scoped>
.historico-container {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 1.5rem;
}

.historico-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.historico-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.btn-refresh {
  background: transparent;
  border: 1px solid #334155;
  color: #94a3b8;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn-refresh:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.historico-lista {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.historico-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  transition: border-color 0.2s;
}

.historico-item:hover {
  border-color: #475569;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.item-arquivo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 500;
}

.item-arquivo i {
  color: #22c55e;
  flex-shrink: 0;
}

.arquivo-nome {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-data {
  font-size: 0.75rem;
  color: #64748b;
}

.item-stats {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: #94a3b8;
}

.stat i {
  font-size: 0.875rem;
}

.stat.success {
  color: #22c55e;
}

.stat.warning {
  color: #f59e0b;
}

.stat.error {
  color: #ef4444;
}

.btn-deletar {
  background: transparent;
  border: 1px solid transparent;
  color: #64748b;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-deletar:hover {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-box {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4);
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}

.modal-titulo {
  font-size: 1.125rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem;
}

.modal-desc {
  font-size: 0.8125rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0 0 1.5rem;
}

.modal-desc strong {
  color: #e2e8f0;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-cancelar {
  flex: 1;
  padding: 0.625rem;
  background: transparent;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancelar:hover {
  border-color: #94a3b8;
  color: #e2e8f0;
}

.btn-confirmar-deletar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.625rem;
  background: #ef4444;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-confirmar-deletar:hover:not(:disabled) {
  background: #dc2626;
}

.btn-confirmar-deletar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .historico-item {
    flex-direction: column;
    align-items: stretch;
  }

  .item-stats {
    justify-content: flex-start;
  }

  .btn-deletar {
    align-self: flex-end;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
