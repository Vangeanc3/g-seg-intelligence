<template>
  <footer class="landing-footer">
    <div class="footer-content">
      <div class="footer-grid">
        <!-- Logo e tagline -->
        <div class="footer-col brand">
          <div class="footer-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#3b82f6"/>
              <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#60a5fa"/>
            </svg>
            <span class="footer-logo-text">G-SEG</span>
          </div>
          <p class="footer-tagline">
            Inteligência criminal para negócios mais seguros em Belém.
          </p>
          <div class="footer-social">
            <a href="#" class="social-link" aria-label="LinkedIn">
              <i class="mdi mdi-linkedin"></i>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <i class="mdi mdi-twitter"></i>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <i class="mdi mdi-instagram"></i>
            </a>
          </div>
        </div>

        <!-- Produto -->
        <div class="footer-col">
          <h4 class="footer-col-titulo">Produto</h4>
          <ul class="footer-links">
            <li><a href="#features">Funcionalidades</a></li>
            <li><a href="#planos">Planos e Preços</a></li>
            <li><a href="#">API</a></li>
            <li><a href="#">Atualizações</a></li>
          </ul>
        </div>

        <!-- Empresa -->
        <div class="footer-col">
          <h4 class="footer-col-titulo">Empresa</h4>
          <ul class="footer-links">
            <li><a href="#">Sobre nós</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Carreiras</a></li>
            <li><a href="#">Contato</a></li>
          </ul>
        </div>

        <!-- Recursos -->
        <div class="footer-col">
          <h4 class="footer-col-titulo">Recursos</h4>
          <ul class="footer-links">
            <li><a href="#">Documentação</a></li>
            <li><a href="#">Tutoriais</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Suporte</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="footer-col">
          <h4 class="footer-col-titulo">Legal</h4>
          <ul class="footer-links">
            <li><a href="#">Termos de Uso</a></li>
            <li><a href="#">Privacidade</a></li>
            <li><a href="#">Cookies</a></li>
            <li><a href="#">LGPD</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">
          © 2025 G-SEG Intelligence. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.landing-footer {
  background: #0c1222;
  border-top: 1px solid #1e293b;
  padding: 3rem 2rem 1.5rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-col.brand {
  gap: 0.75rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
}

.footer-tagline {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.footer-social {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  color: #60a5fa;
  text-decoration: none;
  transition: all 0.2s;
}

.social-link:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

.social-link i {
  font-size: 1.125rem;
}

.footer-col-titulo {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.footer-links a {
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #3b82f6;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid #1e293b;
  text-align: center;
}

.footer-copyright {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer-col.brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-col.brand {
    grid-column: 1;
  }
}
</style>
