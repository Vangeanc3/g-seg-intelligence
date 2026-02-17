<template>
  <section id="planos" class="planos">
    <div class="planos-content">
      <div class="section-header">
        <span class="section-tag">Planos</span>
        <h2 class="section-titulo">Escolha o plano ideal para seu negócio</h2>
        <p class="section-descricao">
          Todos os planos incluem acesso ao mapa interativo e atualizações mensais de dados.
        </p>
      </div>

      <div class="planos-grid">
        <div
          v-for="plano in planos"
          :key="plano.nome"
          class="plano-card"
          :class="{ destaque: plano.destaque }"
        >
          <div v-if="plano.destaque" class="plano-badge">Mais Popular</div>
          <h3 class="plano-nome">{{ plano.nome }}</h3>
          <p class="plano-desc">{{ plano.descricao }}</p>
          <div class="plano-preco">
            <span class="preco-valor">{{ plano.preco }}</span>
            <span v-if="plano.periodo" class="preco-periodo">{{ plano.periodo }}</span>
          </div>
          <ul class="plano-features">
            <li v-for="feat in plano.features" :key="feat" class="plano-feat">
              <i class="mdi mdi-check-circle"></i>
              {{ feat }}
            </li>
          </ul>
          <router-link
            to="/auth/registro"
            class="plano-btn"
            :class="{ primary: plano.destaque }"
          >
            {{ plano.cta }}
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const planos = [
  {
    nome: 'Básico',
    descricao: 'Para pequenos negócios que precisam de visibilidade básica.',
    preco: 'R$ 97',
    periodo: '/mês',
    destaque: false,
    cta: 'Começar Grátis',
    features: [
      'Mapa interativo de crimes',
      'Filtros por bairro e tipo',
      'Até 3 relatórios/mês',
      'Dados atualizados mensalmente',
      'Suporte por email',
    ],
  },
  {
    nome: 'Profissional',
    descricao: 'Para empresas que precisam de análise aprofundada.',
    preco: 'R$ 297',
    periodo: '/mês',
    destaque: true,
    cta: 'Testar 14 Dias Grátis',
    features: [
      'Tudo do Básico',
      'Analytics avançado completo',
      'Relatórios PDF ilimitados',
      'Exportação CSV',
      'Dados atualizados semanalmente',
      'API de integração',
      'Suporte prioritário',
    ],
  },
  {
    nome: 'Enterprise',
    descricao: 'Para grandes operações com necessidades customizadas.',
    preco: 'Sob consulta',
    periodo: '',
    destaque: false,
    cta: 'Falar com Vendas',
    features: [
      'Tudo do Profissional',
      'Cobertura Região Metropolitana',
      'Dashboard customizado',
      'Dados em tempo real',
      'SLA dedicado',
      'Integração com seus sistemas',
      'Gerente de conta',
    ],
  },
]
</script>

<style scoped>
.planos {
  padding: 6rem 2rem;
  background: #0c1222;
}

.planos-content {
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
  max-width: 500px;
  margin: 0 auto;
}

.planos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.plano-card {
  position: relative;
  padding: 2rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.plano-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.plano-card.destaque {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(59, 130, 246, 0.15);
}

.plano-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 1rem;
  background: #3b82f6;
  color: white;
  font-size: 0.6875rem;
  font-weight: 600;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.plano-nome {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.375rem;
}

.plano-desc {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0 0 1.25rem;
  line-height: 1.5;
}

.plano-preco {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.preco-valor {
  font-size: 2.25rem;
  font-weight: 800;
  color: #e2e8f0;
}

.preco-periodo {
  font-size: 0.875rem;
  color: #64748b;
}

.plano-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
}

.plano-feat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #94a3b8;
}

.plano-feat i {
  color: #22c55e;
  font-size: 1rem;
  flex-shrink: 0;
}

.plano-btn {
  display: block;
  text-align: center;
  padding: 0.75rem;
  border: 1px solid #334155;
  border-radius: 10px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.2s;
}

.plano-btn:hover {
  border-color: #94a3b8;
  color: #e2e8f0;
}

.plano-btn.primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.plano-btn.primary:hover {
  background: #2563eb;
}

@media (max-width: 900px) {
  .planos-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
