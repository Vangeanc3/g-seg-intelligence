<template>
  <section id="como-funciona" class="como-funciona">
    <div class="cf-content">
      <div class="section-header">
        <span class="section-tag">Como Funciona</span>
        <h2 class="section-titulo">Inteligência criminal em 3 passos</h2>
      </div>

      <div class="passos">
        <div v-for="(p, i) in passos" :key="i" class="passo">
          <div class="passo-numero">{{ i + 1 }}</div>
          <div class="passo-conteudo">
            <h3 class="passo-titulo">{{ p.titulo }}</h3>
            <p class="passo-desc">{{ p.descricao }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const passos = [
  {
    titulo: 'Escolha sua região',
    descricao: 'Selecione bairros, tipos de crime e período de interesse. Filtre exatamente o que importa pro seu negócio.',
  },
  {
    titulo: 'Analise os dados',
    descricao: 'Visualize no mapa interativo, explore gráficos de tendências, identifique padrões e horários de risco.',
  },
  {
    titulo: 'Tome decisões',
    descricao: 'Exporte relatórios profissionais em PDF ou CSV, apresente pra diretoria e ajuste sua estratégia de segurança.',
  },
]
</script>

<style scoped>
.como-funciona {
  padding: 6rem 2rem;
}

.cf-content {
  max-width: 800px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
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
  margin: 0;
}

.passos {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.passo {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.75rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  transition: all 0.3s;
}

.passo:hover {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.passo-numero {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  font-size: 1.25rem;
  font-weight: 700;
  border-radius: 12px;
  flex-shrink: 0;
}

.passo-conteudo {
  flex: 1;
}

.passo-titulo {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.375rem;
}

.passo-desc {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 600px) {
  .passo {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
