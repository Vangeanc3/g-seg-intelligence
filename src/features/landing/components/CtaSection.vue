<template>
  <section class="cta-section">
    <div class="cta-content">
      <div class="cta-glow"></div>
      <h2 class="cta-titulo">Pronto para proteger seu negócio?</h2>
      <p class="cta-descricao">
        Comece agora e tenha acesso a inteligência de segurança em tempo real para tomar
        melhores decisões sobre localização e operação do seu negócio.
      </p>
      <div class="cta-buttons">
        <router-link to="/auth/registro" class="cta-btn primary">
          Criar Conta Grátis
        </router-link>
        <router-link to="/auth/login" class="cta-btn secondary">
          Já tenho conta
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.cta-section {
  padding: 5rem 2rem;
  background: #0c1222;
  position: relative;
  overflow: hidden;
}

.cta-content {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.cta-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.cta-titulo {
  position: relative;
  z-index: 1;
  font-size: 2.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 1rem;
  line-height: 1.2;
}

.cta-descricao {
  position: relative;
  z-index: 1;
  font-size: 1.0625rem;
  color: #94a3b8;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.cta-buttons {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  min-width: 200px;
}

.cta-btn.primary {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.cta-btn.primary:hover {
  background: #2563eb;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

.cta-btn.secondary {
  background: transparent;
  color: #94a3b8;
  border: 1px solid #334155;
}

.cta-btn.secondary:hover {
  color: #e2e8f0;
  border-color: #94a3b8;
}

@media (min-width: 640px) {
  .cta-buttons {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .cta-titulo {
    font-size: 1.75rem;
  }

  .cta-descricao {
    font-size: 0.9375rem;
  }
}
</style>
