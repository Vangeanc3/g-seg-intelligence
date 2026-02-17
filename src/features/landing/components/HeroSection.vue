<template>
  <section class="hero">
    <div class="hero-content">
      <div class="hero-badge">
        <i class="mdi mdi-shield-check"></i>
        Plataforma de Inteligência Criminal
      </div>
      <h1 class="hero-titulo">
        O <span class="hero-destaque">Google Maps</span> do crime em Belém
      </h1>
      <p class="hero-descricao">
        Transforme dados criminais em decisões estratégicas. Mapas interativos,
        análises em tempo real e relatórios personalizados para proteger seu negócio.
      </p>
      <div class="hero-ctas">
        <router-link to="/auth/registro" class="btn-primary">
          Começar Agora
          <i class="mdi mdi-arrow-right"></i>
        </router-link>
        <a href="#features" class="btn-secondary">
          <i class="mdi mdi-play-circle"></i>
          Ver Recursos
        </a>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-valor">500+</span>
          <span class="stat-label">Ocorrências mapeadas</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-valor">72</span>
          <span class="stat-label">Bairros cobertos</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-valor">24/7</span>
          <span class="stat-label">Monitoramento</span>
        </div>
      </div>
    </div>
    <!-- Glow decorativo -->
    <div class="hero-glow"></div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem 4rem;
  overflow: hidden;
}

.hero-content {
  max-width: 720px;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 50px;
  color: #60a5fa;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.hero-titulo {
  font-size: 3.25rem;
  font-weight: 800;
  color: #e2e8f0;
  line-height: 1.1;
  margin: 0 0 1.25rem;
}

.hero-destaque {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-descricao {
  font-size: 1.125rem;
  color: #94a3b8;
  line-height: 1.7;
  margin: 0 0 2rem;
}

.hero-ctas {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: #3b82f6;
  color: white;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: #94a3b8;
  color: #e2e8f0;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-valor {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #334155;
}

/* Glow */
.hero-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

@media (max-width: 640px) {
  .hero-titulo {
    font-size: 2.25rem;
  }
  .hero-ctas {
    flex-direction: column;
  }
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }
  .stat-divider {
    width: 32px;
    height: 1px;
  }
}
</style>
