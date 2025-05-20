<template>
  <div class="note-list">
    <div v-if="isLoading" class="loading">
      <div class="loading-indicator"></div>
      <p>Cargando notas...</p>
    </div>
    
    <div v-else-if="notes.length === 0" class="empty-state">
      <p>{{ emptyMessage }}</p>
    </div>
    
    <div v-else>
      <div class="notes-grid">
        <NoteItem
          v-for="note in notes"
          :key="noteKey(note)"
          :note="note"
          @edit="$emit('edit', note)"
          @archive="$emit('archive', $event)"
          @unarchive="$emit('unarchive', $event)"
          @delete="$emit('delete', $event)"
          @pin="$emit('pin', $event)"
          @unpin="$emit('unpin', $event)"
          @filter-by-tag="$emit('filter-by-tag', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NoteItem from './NoteItem.vue';
import { generateKey } from '../utils/helpers';

export default {
  name: 'NoteList',
  components: {
    NoteItem
  },
  props: {
    notes: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    emptyMessage: {
      type: String,
      default: 'No hay notas disponibles'
    }
  },
  emits: ['edit', 'archive', 'unarchive', 'delete', 'pin', 'unpin', 'filter-by-tag'],
  created() {
    // Generar función para claves únicas optimizadas para renderizado
    this.noteKey = generateKey(this.notes);
  },
  watch: {
    // Regenerar la función de claves cuando cambian las notas
    notes: {
      handler(newNotes) {
        this.noteKey = generateKey(newNotes);
      },
      deep: false // No necesitamos observación profunda
    }
  }
}
</script>

<style scoped>
.note-list {
  margin-top: 1rem;
}

.loading, .empty-state {
  text-align: center;
  padding: 2rem;
  background-color: var(--color-card);
  border-radius: 0.5rem;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4.4rem;
  margin-bottom: 2rem;
  will-change: transform; /* Mejora rendimiento en transformaciones */
  contain: content; /* Mejora de rendimiento en layout */
}

@media (max-width: 768px) {
  .notes-grid {
    grid-template-columns: 1fr;
    gap: 4.4rem;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state p {
  color: #6c757d;
  font-size: 1.5rem;
  font-weight: 500;
}

/* Animaciones para la lista de notas - optimizadas */
.note-list-enter-active,
.note-list-leave-active {
  transition: all 0.3s ease-out;
  will-change: opacity, transform;
}

.note-list-enter-from,
.note-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style> 