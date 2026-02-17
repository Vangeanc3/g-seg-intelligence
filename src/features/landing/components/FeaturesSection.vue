<template>
  <section id="features" class="features">
    <div class="features-content">
      <div class="section-header">
        <span class="section-tag">Recursos</span>
        <h2 class="section-titulo">Tudo que você precisa para decisões seguras</h2>
        <p class="section-descricao">
          Dados criminais transformados em inteligência visual e acionável para o seu negócio.
        </p>
      </div>

      <div class="features-grid">
        <div v-for="f in features" :key="f.titulo" class="feature-card">
          <div class="feature-icon" :style="{ background: f.cor + '15', color: f.cor }">
            <i :class="f.icone"></i>
          </div>
          <h3 class="feature-titulo">{{ f.titulo }}</h3>
          <p class="feature-desc">{{ f.descricao }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    titulo: 'Mapa Interativo',
    descricao: 'Visualize crimes em tempo real no mapa com heatmaps, clusters e filtros avançados por bairro, tipo e período.',
    icone: 'mdi mdi-map-marker-radius',
    cor: '#3b82f6',
  },
  {
    titulo: 'Analytics Avançado',
    descricao: 'Gráficos de tendências, ranking de bairros, distribuição por horário e dia da semana para análise estratégica.',
    icone: 'mdi mdi-chart-line',
    cor: '#8b5cf6',
  },
  {
    titulo: 'Relatórios PDF',
    descricao: 'Gere boletins de segurança profissionais em PDF com filtros personalizados para apresentar a clientes e diretoria.',
    icone: 'mdi mdi-file-pdf-box',
    cor: '#ef4444',
  },
  {
    titulo: 'Exportação CSV',
    descricao: 'Exporte dados brutos filtrados em CSV compatível com Excel para suas próprias análises e integrações.',
    icone: 'mdi mdi-file-delimited',
    cor: '#22c55e',
  },
  {
    titulo: 'Dados da SEGUP',
    descricao: 'Dados oficiais da Secretaria de Segurança Pública do Pará via parceria acadêmica com a UFPA.',
    icone: 'mdi mdi-shield-check',
    cor: '#f59e0b',
  },
  {
    titulo: 'Cobertura Total',
    descricao: '72 bairros de Belém cobertos, incluindo área insular. Expansão para a Região Metropolitana em breve.',
    icone: 'mdi mdi-city',
    cor: '#06b6d4',
  },
]
</script>

<style scoped>
.features {
  padding: 6rem 2rem;
  background: #0c1222;
}

.features-content {
  max-width: 1100px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-tag {
  display: inline-block;
  padding: 0.3rem 0.875rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50px;
  color: #60a5fa;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.section-titulo {
  font-size: 2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.75rem;
}

.section-descricao {
  font-size: 1rem;
  color: #64748b;
  max-width: 550px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.feature-card {
  padding: 1.75rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  font-size: 1.375rem;
  margin-bottom: 1rem;
}

.feature-titulo {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.5rem;
}

.feature-desc {
  font-size: 0.8125rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  .section-titulo {
    font-size: 1.5rem;
  }
}
</style>
