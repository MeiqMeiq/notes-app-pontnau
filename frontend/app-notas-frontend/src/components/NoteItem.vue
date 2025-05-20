<template>
  <div class="note-item" :class="{ 'is-archived': note.is_archived, 'is-pinned': note.is_pinned }">
    <button
      v-if="!note.is_archived"
      class="pin-button"
      :class="{ 'is-pinned': note.is_pinned }"
      @click="togglePin"
      :title="note.is_pinned ? 'Desfijar nota' : 'Fijar nota'"
    >
      📌
    </button>
    
    <div class="note-content">
      <h3 class="note-title">{{ note.title }}</h3>
      <p class="note-text">{{ note.content }}</p>
      
      <div v-if="note.tags && note.tags.length > 0" class="note-tags">
        <span 
          v-for="tag in note.tags" 
          :key="tag.name" 
          class="tag-item"
          :class="{ 'non-clickable': note.is_archived }"
          @click="!note.is_archived && $emit('filter-by-tag', tag.name)"
        >
          {{ tag.name }}
        </span>
      </div>
      
      <p class="note-date">
        <small>Actualizado: {{ formatDate(note.updated_at) }}</small>
      </p>
    </div>
    
    <div class="note-actions">
      <button 
        v-if="!note.is_archived"
        class="btn-action edit" 
        title="Editar"
        @click="$emit('edit', note)"
      >
        Editar
      </button>
      
      <button 
        v-if="!note.is_archived"
        class="btn-action archive" 
        title="Archivar"
        @click="$emit('archive', note.id)"
      >
        Archivar
      </button>
      
      <button 
        v-if="note.is_archived"
        class="btn-action unarchive" 
        title="Desarchivar"
        @click="$emit('unarchive', note.id)"
      >
        Desarchivar
      </button>
      
      <button 
        class="btn-action delete" 
        title="Eliminar"
        @click="handleDelete"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoteItem',
  props: {
    note: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    handleDelete() {
      if (confirm(`¿Estás seguro de que deseas eliminar la nota "${this.note.title}"?`)) {
        this.$emit('delete', this.note.id);
      }
    },
    togglePin() {
      if (this.note.is_pinned) {
        this.$emit('unpin', this.note.id);
      } else {
        this.$emit('pin', this.note.id);
      }
    }
  }
}
</script>

<style scoped>
.note-item {
  background-color: var(--color-card);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px var(--color-shadow);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
  height: 100%;
  margin: 0.25rem;
}

.note-item.is-pinned {
  background-color: #fff3cc;
  border-color: #ffd54f;
}

.note-item.is-archived {
  background-color: var(--color-archived);
  border: 1px solid var(--color-archived-border);
}

.note-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background-color: var(--color-primary);
  opacity: 0.7;
}

.note-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.note-item:hover::before {
  opacity: 1;
}

.note-item.is-archived::before {
  background-color: var(--color-archived-border);
}

.pin-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  z-index: 10;
  opacity: 0.5;
  transform: rotate(45deg);
  transition: all 0.2s ease;
}

.pin-button:hover {
  opacity: 1;
  transform: rotate(0) scale(1.2);
}

.pin-button.is-pinned {
  opacity: 1;
  transform: rotate(0);
}

.note-content {
  flex: 1;
  margin-bottom: 1.25rem;
}

.note-title {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.35rem;
  color: var(--color-text);
  font-weight: 600;
  word-break: break-word;
  line-height: 1.3;
}

.note-text {
  margin-bottom: 1rem;
  white-space: pre-line;
  color: var(--color-text);
  line-height: 1.5;
  word-break: break-word;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag-item {
  background-color: var(--color-primary);
  color: white;
  border-radius: 2rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-item.non-clickable {
  cursor: default;
  opacity: 0.7;
}

.tag-item:not(.non-clickable):hover {
  opacity: 0.85;
  transform: translateY(-2px);
}

.note-date {
  margin-bottom: 0.5rem;
  color: #6c757d;
  font-size: 0.875rem;
}

.note-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--color-border);
}

.btn-action {
  background: none;
  border: 1px solid var(--color-border);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background-color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  flex: 1;
  min-width: 80px;
}

.btn-action:hover {
  transform: scale(1.05);
}

.edit:hover {
  background-color: rgba(255, 183, 77, 0.2);
}

.archive:hover, .unarchive:hover {
  background-color: rgba(255, 160, 0, 0.2);
}

.delete {
  color: #d9534f;
  border-color: #d9534f;
}

.delete:hover {
  background-color: rgba(255, 90, 90, 0.2);
}
</style> 