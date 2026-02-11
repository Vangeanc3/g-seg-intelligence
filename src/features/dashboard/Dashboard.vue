<template>
  <div class="dashboard">
    <h1>Dashboard - Belém/PA</h1>
    <p>Sistema funcionando! 🎉</p>

    <div class="stats-grid">
      <div class="stat-card">
        <i class="mdi mdi-alert-circle"></i>
        <div>
          <h3>1,247</h3>
          <p>Total de Crimes</p>
        </div>
      </div>

      <div class="stat-card">
        <i class="mdi mdi-check-circle"></i>
        <div>
          <h3>623</h3>
          <p>Casos Solucionados</p>
        </div>
      </div>

      <div class="stat-card">
        <i class="mdi mdi-clock"></i>
        <div>
          <h3>412</h3>
          <p>Em Investigação</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  color: white;
}

.dashboard h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.dashboard p {
  color: #94a3b8;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #1e293b;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #334155;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card i {
  font-size: 2.5rem;
  color: #3b82f6;
}

.stat-card h3 {
  font-size: 1.875rem;
  margin-bottom: 0.25rem;
}

.stat-card p {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}
</style>
