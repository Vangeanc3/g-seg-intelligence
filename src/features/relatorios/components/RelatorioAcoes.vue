<template>
  <div class="acoes-container">
    <button class="btn-acao voltar" @click="$emit('voltar')">
      <i class="mdi mdi-arrow-left"></i>
      Voltar e Editar
    </button>
    <div class="acoes-export">
      <button class="btn-acao csv" @click="$emit('exportarCsv')">
        <i class="mdi mdi-file-delimited"></i>
        Exportar CSV
      </button>
      <button class="btn-acao pdf" @click="$emit('exportarPdf')">
        <i class="mdi mdi-file-pdf-box"></i>
        Exportar PDF
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  voltar: []
  exportarCsv: []
  exportarPdf: []
}>()
</script>

<style scoped>
.acoes-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.acoes-export {
  display: flex;
  gap: 0.75rem;
}

.btn-acao {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid #334155;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-acao.voltar {
  background: transparent;
  color: #94a3b8;
}

.btn-acao.voltar:hover {
  border-color: #94a3b8;
  color: #e2e8f0;
}

.btn-acao.csv {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.btn-acao.csv:hover {
  background: rgba(34, 197, 94, 0.2);
}

.btn-acao.pdf {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.btn-acao.pdf:hover {
  background: rgba(239, 68, 68, 0.2);
}

@media (max-width: 768px) {
  .acoes-container {
    flex-direction: column;
  }

  .acoes-export {
    width: 100%;
  }

  .btn-acao {
    flex: 1;
  }
}
</style>
