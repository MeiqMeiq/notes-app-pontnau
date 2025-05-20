<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView
  },
  data() {
    return {
      // Rastrear si el usuario está desplazándose para optimizar renderizado
      isScrolling: false
    }
  },
  mounted() {
    // Optimizar el renderizado durante el desplazamiento
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (!this.isScrolling) {
        this.isScrolling = true;
        // Esperar hasta que el desplazamiento se detenga
        window.requestAnimationFrame(() => {
          this.isScrolling = false;
        });
      }
    }
  }
}
</script>

<template>
  <header>
    <nav class="navbar">
      <div class="logo">App de Notas</div>
      <div class="nav-links">
        <RouterLink to="/" class="nav-link">Notas Activas</RouterLink>
        <RouterLink to="/archived" class="nav-link">Notas Archivadas</RouterLink>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>App de Notas</h3>
        <p>Una aplicación simple para gestionar notas personales.</p>
      </div>
      
      <div class="footer-section">
        <h3>Enlaces</h3>
        <ul>
          <li><RouterLink to="/">Notas Activas</RouterLink></li>
          <li><RouterLink to="/archived">Notas Archivadas</RouterLink></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3>Contacto</h3>
        <p>Email: gonzalopontnau@gmail.com</p>
        <div class="social-links">
          <a href="https://www.linkedin.com/in/gonzalopontnau" target="_blank" rel="noopener" title="LinkedIn" class="social-link">
            <i class="fab fa-linkedin-in"></i>
          </a>
          <a href="https://github.com/GonzaloPontnau" target="_blank" rel="noopener" title="GitHub" class="social-link">
            <i class="fab fa-github"></i>
          </a>
          <a href="https://gonzalopontnau.github.io/" target="_blank" rel="noopener" title="Portfolio" class="social-link">
            <i class="fas fa-globe"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
@import './assets/main.css';

/* CSS crítico para mejorar rendimiento */
body {
  will-change: scroll-position;
  overflow-anchor: auto;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2.5rem;
  background-color: var(--color-primary);
  color: var(--color-text);
  box-shadow: 0 2px 8px var(--color-shadow);
  will-change: transform; /* Optimizar animaciones */
  contain: layout style; /* Aislamiento de Layout */
}

.logo {
  font-size: 1.75rem;
  font-weight: bold;
  color: var(--color-button-text);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--color-button-text);
  text-decoration: none;
  padding: 0.75rem 0;
  position: relative;
  font-weight: 600;
  font-size: 1.1rem;
  opacity: 0.9;
  transition: all 0.3s ease;
}

.nav-link:hover {
  opacity: 1;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: 0;
  left: 0;
  background-color: var(--color-button-text);
  transition: width 0.3s ease;
  border-radius: 3px;
}

.nav-link:hover::after,
.router-link-active::after {
  width: 100%;
}

.router-link-active {
  opacity: 1;
}

main {
  min-height: calc(100vh - 80px - 250px); /* Adjusted for footer */
  background-color: var(--color-background);
  padding-bottom: 3rem;
}

/* Footer styles */
.footer {
  background-color: #ffb74d;
  color: var(--color-text);
  padding-top: 2rem;
  padding-bottom: 2rem;
  box-shadow: 0 -2px 8px var(--color-shadow);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 0 2rem;
}

.footer-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-button-text);
  font-weight: 600;
  font-size: 1.6rem;
}

.footer-section p {
  margin-top: 0;
  color: var(--color-button-text);
  opacity: 0.9;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: var(--color-button-text);
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.footer-section a:hover {
  opacity: 1;
  text-decoration: underline;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-accent);
  color: white;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem 1.5rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    width: 100%;
    justify-content: center;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>
