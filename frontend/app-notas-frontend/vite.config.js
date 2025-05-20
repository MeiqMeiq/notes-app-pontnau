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
    // Optimizar el tamaño del bundle
    minify: 'terser', 
    terserOptions: {
      compress: {
        drop_console: true,  // Eliminar console.log en producción
        drop_debugger: true  // Eliminar debugger statements
      }
    },
    // Dividir chunks por módulos para mejor caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'ui': ['./src/components/NoteItem.vue', './src/components/NoteList.vue', './src/components/NoteForm.vue'],
          'utils': ['./src/utils/helpers.js']
        },
        // Comprimir assets
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name)) {
            return `assets/img/[name]-[hash][extname]`;
          }
          return `assets/${ext}/[name]-[hash][extname]`;
        }
      }
    },
    // Mejorar la carga inicial
    cssCodeSplit: true,
    // Activar tree-shaking agresivo
    assetsInlineLimit: 4096, // Inline pequeños assets
    // Reducir polyfills innecesarios
    target: 'es2015',
    // Genera un archivo index.html en raíz del directorio de distribución
    outDir: 'dist',
    // Asegura que los assets se referencien correctamente
    assetsDir: 'assets',
    // Genera sourcemaps para depuración
    sourcemap: true,
    // Mejora el manejo de rutas para history mode
    emptyOutDir: true
  },
  base: '/',
  // Optimizaciones de servidor de desarrollo
  server: {
    // Comprimir respuestas
    compress: true,
    // Pre-transformar y cachear archivos
    warmup: {
      clientFiles: ['./src/main.js', './src/App.vue']
    }
  }
})
