<template>
  <div class="not-found">
    <div class="nf-content">
      <div class="nf-code">404</div>
      <div class="nf-icon">
        <i class="mdi mdi-map-marker-question"></i>
      </div>
      <h1 class="nf-titulo">Página não encontrada</h1>
      <p class="nf-desc">
        A rota que você tentou acessar não existe ou foi movida.
        Verifique o endereço ou volte para uma área segura.
      </p>
      <div class="nf-actions">
        <router-link to="/" class="nf-btn primary">
          <i class="mdi mdi-home"></i>
          Ir para o Início
        </router-link>
        <router-link to="/app/dashboard" class="nf-btn secondary">
          <i class="mdi mdi-view-dashboard"></i>
          Ir para o Dashboard
        </router-link>
      </div>
    </div>
    <div class="nf-glow"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.nf-content {
  text-align: center;
  position: relative;
  z-index: 1;
  max-width: 480px;
}

.nf-code {
  font-size: 8rem;
  font-weight: 900;
  color: rgba(59, 130, 246, 0.12);
  line-height: 1;
  margin-bottom: -1rem;
  user-select: none;
}

.nf-icon {
  font-size: 3rem;
  color: #3b82f6;
  margin-bottom: 1.25rem;
}

.nf-titulo {
  font-size: 1.75rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.75rem;
}

.nf-desc {
  font-size: 0.9375rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 2rem;
}

.nf-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.nf-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.nf-btn.primary {
  background: #3b82f6;
  color: white;
}

.nf-btn.primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.nf-btn.secondary {
  border: 1px solid #334155;
  color: #94a3b8;
}

.nf-btn.secondary:hover {
  border-color: #94a3b8;
  color: #e2e8f0;
}

.nf-glow {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

@media (max-width: 480px) {
  .nf-code {
    font-size: 5rem;
  }

  .nf-titulo {
    font-size: 1.375rem;
  }

  .nf-actions {
    flex-direction: column;
  }
}
</style>
