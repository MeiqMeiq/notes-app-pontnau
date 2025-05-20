import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // Genera un archivo index.html en raíz del directorio de distribución
    outDir: 'dist',
    // Asegura que los assets se referencien correctamente
    assetsDir: 'assets',
    // Genera sourcemaps para depuración
    sourcemap: true,
    // Mejora el manejo de rutas para history mode
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  base: ''
})
