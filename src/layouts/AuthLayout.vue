<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-header">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#3b82f6"/>
            <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#60a5fa"/>
          </svg>
        </div>
        <h1>G-SEG Analytics</h1>
        <p>Inteligência Criminal Corporativa - Belém/PA</p>
      </div>

      <router-view />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 440px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 16px;
  margin-bottom: 1rem;
}

.auth-header h1 {
  margin: 0;
  color: white;
  font-size: 1.875rem;
  font-weight: 700;
}

.auth-header p {
  margin: 0.5rem 0 0;
  color: #94a3b8;
  font-size: 0.875rem;
}
</style>
