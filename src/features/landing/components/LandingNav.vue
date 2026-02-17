<template>
  <nav class="landing-nav">
    <div class="nav-content">
      <div class="nav-brand">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#3b82f6"/>
          <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#60a5fa"/>
        </svg>
        <span class="brand-text">G-SEG</span>
      </div>
      <div class="nav-links">
        <a href="#features" class="nav-link">Recursos</a>
        <a href="#como-funciona" class="nav-link">Como Funciona</a>
        <a href="#planos" class="nav-link">Planos</a>
        <router-link to="/auth/login" class="nav-link btn-entrar">Entrar</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.landing-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(51, 65, 85, 0.5);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.875rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #e2e8f0;
}

.btn-entrar {
  background: #3b82f6;
  color: white !important;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.btn-entrar:hover {
  background: #2563eb;
}
</style>
