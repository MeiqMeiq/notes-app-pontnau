<template>
  <div class="note-form card">
    <h3>{{ isEditing ? 'Editar Nota' : 'Nueva Nota' }}</h3>
    
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Título</label>
        <input 
          type="text" 
          id="title"
          v-model="form.title"
          required
          placeholder="Título de la nota"
          class="form-control"
        >
      </div>
      
      <div class="form-group">
        <label for="content">Contenido</label>
        <textarea
          id="content"
          v-model="form.content"
          required
          placeholder="Escribe el contenido de tu nota aquí..."
          class="form-control"
          rows="4"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="tags">Etiquetas</label>
        <div class="tags-input-container">
          <input 
            type="text" 
            id="tagInput"
            v-model="tagInput"
            placeholder="Escribe y presiona Enter para agregar etiquetas"
            class="form-control"
            @keyup.enter="addTag"
          >
          <div class="tags-list" v-if="form.tags.length > 0">
            <span v-for="(tag, index) in form.tags" :key="index" class="tag-item">
              {{ tag }}
              <button type="button" class="tag-remove" @click="removeTag(index)">×</button>
            </span>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Actualizar' : 'Crear' }}
        </button>
        <button 
          v-if="isEditing" 
          type="button" 
          class="btn btn-secondary" 
          @click="$emit('cancel')"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'NoteForm',
  props: {
    note: {
      type: Object,
      default: () => ({
        title: '',
        content: '',
        tags: []
      })
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        title: this.note.title || '',
        content: this.note.content || '',
        tags: this.note.tags ? [...this.note.tags] : []
      },
      tagInput: ''
    }
  },
  watch: {
    note(newNote) {
      this.form.title = newNote.title || '';
      this.form.content = newNote.content || '';
      this.form.tags = newNote.tags ? [...newNote.tags] : [];
    }
  },
  methods: {
    addTag() {
      const tag = this.tagInput.trim();
      if (tag && !this.form.tags.includes(tag)) {
        this.form.tags.push(tag);
      }
      this.tagInput = '';
    },
    removeTag(index) {
      this.form.tags.splice(index, 1);
    },
    submitForm() {
      if (!this.form.title || !this.form.content) return;
      
      this.$emit('submit', { ...this.form });
      
      if (!this.isEditing) {
        // Limpiar el formulario después de crear
        this.form.title = '';
        this.form.content = '';
        this.form.tags = [];
      }
    }
  }
}
</script>

<style scoped>
.note-form {
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  font-size: 1rem;
  background-color: #ffffff;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(255, 183, 77, 0.2);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-item {
  background-color: var(--color-primary);
  color: white;
  border-radius: 2rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  margin-left: 0.25rem;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  padding: 0;
  width: 20px;
  height: 20px;
  justify-content: center;
  line-height: 1;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style> 