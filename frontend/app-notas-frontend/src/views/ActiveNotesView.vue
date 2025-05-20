<template>
  <div class="active-notes-view">
    <div class="page-header">
      <h1>Notas Activas</h1>
    </div>

    <div class="container">
      <div class="notes-container">
        <h2>Mis Notas {{ selectedTag ? `(Etiqueta: ${selectedTag})` : '' }}</h2>

        <!-- Nueva nota (formulario integrado) -->
        <div v-if="!isEditing" class="note-item new-note">
          <div class="note-content">
            <input
              type="text"
              v-model="newNote.title"
              placeholder="Título de la nueva nota"
              class="note-title-input"
            />
            <textarea
              v-model="newNote.content"
              placeholder="Escribe el contenido de tu nota aquí..."
              class="note-content-input"
            ></textarea>

            <div class="tags-input-container">
              <label>Etiquetas:</label>
              <div class="tag-input-wrapper">
                <input
                  type="text"
                  v-model="tagInput"
                  placeholder="Escribe y presiona Enter para agregar etiquetas"
                  class="tag-input"
                  @keyup.enter="addTagToNewNote"
                />
              </div>
              <div class="selected-tags" v-if="newNote.tags.length > 0">
                <span v-for="(tag, index) in newNote.tags" :key="index" class="tag-item">
                  {{ tag }}
                  <button type="button" class="tag-remove" @click="removeTagFromNewNote(index)">×</button>
                </span>
              </div>
            </div>

            <div class="form-actions">
              <button
                @click="createNote"
                :disabled="!newNote.title || !newNote.content"
                class="btn btn-primary"
              >
                Crear Nota
              </button>
            </div>
          </div>
        </div>

        <!-- Formulario de edición -->
        <NoteForm
          v-if="isEditing"
          :note="editingNote"
          :is-editing="true"
          @submit="handleSubmit"
          @cancel="cancelEdit"
          class="editing-form"
        />

        <!-- Filtro de etiquetas -->
        <div class="tags-filter-container" v-if="allTags.length > 0">
          <div class="tags-header">
            <h3>Filtrar por Etiqueta</h3>
            <button v-if="selectedTag" @click="clearTagFilter" class="btn-clear-filter">
              Limpiar filtro
            </button>
          </div>
          <div class="tags-list">
            <span
              v-for="tag in allTags"
              :key="tag.id"
              class="tag-filter"
              :class="{ active: selectedTag === tag.name }"
            >
              <span @click="filterByTag(tag.name)">{{ tag.name }}</span>
              <button
                type="button"
                class="tag-delete"
                @click.stop="deleteTag(tag.id)"
                title="Eliminar etiqueta"
              >×</button>
            </span>
          </div>
        </div>

        <!-- Lista de notas -->
        <NoteList
          :notes="sortedNotes"
          :is-loading="isLoading"
          empty-message="No tienes notas activas."
          @edit="startEdit"
          @archive="archiveNote"
          @delete="deleteNote"
          @pin="pinNote"
          @unpin="unpinNote"
          @filter-by-tag="filterByTag"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useNotesStore } from '../stores/notes'
import NoteForm from '../components/NoteForm.vue'
import NoteList from '../components/NoteList.vue'
import noteService from '../services/noteService'
import { debounce } from '../utils/helpers'

export default {
  name: 'ActiveNotesView',
  components: {
    NoteForm,
    NoteList,
  },
  data() {
    return {
      isEditing: false,
      editingNote: {
        title: '',
        content: '',
        tags: [],
      },
      newNote: {
        title: '',
        content: '',
        tags: [],
      },
      tagInput: '',
      allTags: [],
      selectedTag: null,
      // Controlar la actualización de UI para mejorar rendimiento
      needsTagsRefresh: false,
      isProcessingOperation: false,
    }
  },
  computed: {
    sortedNotes() {
      return this.notesStore.sortedActiveNotes
    },
    isLoading() {
      return this.notesStore.isLoading
    },
  },
  created() {
    this.notesStore = useNotesStore()
    
    // Configurar función para debounce
    this.debouncedLoadTags = debounce(this.loadTags, 500)
    
    this.loadNotes()
    this.loadTags()
  },
  methods: {
    async loadNotes() {
      if (this.isProcessingOperation) return;
      
      try {
        this.isProcessingOperation = true;
        await this.notesStore.fetchActiveNotes(this.selectedTag)
      } finally {
        this.isProcessingOperation = false;
      }
      
      // Verificar si necesitamos actualizar las etiquetas
      if (this.needsTagsRefresh) {
        this.debouncedLoadTags();
        this.needsTagsRefresh = false;
      }
    },

    async loadTags() {
      try {
        const response = await noteService.getAllTags()
        this.allTags = response.data
      } catch (error) {
        console.error('Error al cargar etiquetas:', error)
      }
    },

    addTagToNewNote() {
      const tag = this.tagInput.trim()
      if (tag && !this.newNote.tags.includes(tag)) {
        this.newNote.tags.push(tag)
      }
      this.tagInput = ''
    },

    removeTagFromNewNote(index) {
      this.newNote.tags.splice(index, 1)
    },

    async createNote() {
      if (!this.newNote.title || !this.newNote.content || this.isProcessingOperation) return
      
      try {
        this.isProcessingOperation = true;
        await this.notesStore.createNote({ ...this.newNote })
        
        // Limpiar el formulario
        this.newNote.title = ''
        this.newNote.content = ''
        this.newNote.tags = []
        
        // Marcar para refrescar etiquetas en lugar de hacerlo inmediatamente
        this.needsTagsRefresh = true;
      } catch (error) {
        console.error('Error al crear la nota:', error)
        alert('No se pudo crear la nota. Por favor, intenta de nuevo.')
      } finally {
        this.isProcessingOperation = false;
      }
    },

    async handleSubmit(note) {
      if (this.isProcessingOperation) return;
      
      try {
        this.isProcessingOperation = true;
        
        if (this.isEditing) {
          await this.notesStore.updateNote(this.editingNote.id, note);
          this.cancelEdit();
          
          // Marcar para refrescar etiquetas en lugar de hacerlo inmediatamente
          this.needsTagsRefresh = true;
        }
      } catch (error) {
        console.error('Error al guardar la nota:', error);
        alert('Error al guardar la nota: ' + error.message);
      } finally {
        this.isProcessingOperation = false;
      }
    },

    startEdit(note) {
      // Evitar múltiples ediciones simultáneas
      if (this.isEditing || this.isProcessingOperation) return;
      
      // Crear una copia profunda de la nota
      const noteCopy = { ...note };
      
      // Transformar los tags del formato objeto { name, id } a simples strings
      if (noteCopy.tags && Array.isArray(noteCopy.tags)) {
        noteCopy.tags = noteCopy.tags.map(tag => typeof tag === 'object' ? tag.name : tag);
      }
      
      this.editingNote = noteCopy;
      this.isEditing = true;
    },

    cancelEdit() {
      this.isEditing = false
      this.editingNote = { title: '', content: '', tags: [] }
    },

    async archiveNote(noteId) {
      if (this.isProcessingOperation) return;
      
      try {
        this.isProcessingOperation = true;
        await this.notesStore.archiveNote(noteId)
      } catch (error) {
        console.error('Error al archivar la nota:', error)
      } finally {
        this.isProcessingOperation = false;
      }
    },

    async deleteNote(noteId) {
      if (!noteId || this.isProcessingOperation) return
      
      try {
        this.isProcessingOperation = true;
        await this.notesStore.deleteNote(noteId)
      } catch (error) {
        console.error('Error al eliminar la nota:', error)
        alert('Error al eliminar la nota: ' + error.message)
      } finally {
        this.isProcessingOperation = false;
      }
    },

    async pinNote(noteId) {
      if (this.isProcessingOperation) return;
      
      try {
        this.isProcessingOperation = true;
        await this.notesStore.pinNote(noteId)
      } catch (error) {
        console.error('Error al fijar la nota:', error)
      } finally {
        this.isProcessingOperation = false;
      }
    },

    async unpinNote(noteId) {
      if (this.isProcessingOperation) return;
      
      try {
        this.isProcessingOperation = true;
        await this.notesStore.unpinNote(noteId)
      } catch (error) {
        console.error('Error al desfijar la nota:', error)
      } finally {
        this.isProcessingOperation = false;
      }
    },

    async filterByTag(tagName) {
      if (this.isProcessingOperation || this.selectedTag === tagName) return;
      
      this.selectedTag = tagName
      await this.loadNotes()
    },

    async clearTagFilter() {
      if (this.isProcessingOperation || !this.selectedTag) return;
      
      this.selectedTag = null
      // Forzar recarga completa ignorando caché
      this.notesStore.lastUpdated = null
      await this.loadNotes()
    },

    async deleteTag(tagId) {
      if (this.isProcessingOperation) return;
      
      if (confirm('¿Estás seguro de que deseas eliminar esta etiqueta?')) {
        try {
          // Deshabilitar la interacción durante la operación
          this.isProcessingOperation = true;
          const button = event.target;
          button.disabled = true;
          button.innerHTML = '×';
          
          await this.notesStore.deleteTag(tagId);
          
          // Ya no es necesario recargar todas las notas porque el store las actualiza
          await this.loadTags();
          
          if (this.selectedTag) {
            const tagExists = this.allTags.some(tag => tag.name === this.selectedTag);
            if (!tagExists) {
              this.clearTagFilter();
            }
          }
        } catch (error) {
          console.error('Error al eliminar la etiqueta:', error);
          alert('No se pudo eliminar la etiqueta. Por favor, intenta de nuevo.');
        } finally {
          this.isProcessingOperation = false;
          if (event && event.target) {
            event.target.disabled = false;
          }
        }
      }
    },
  },
}
</script>

<style scoped>
.active-notes-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-header h1 {
  color: var(--color-text);
  font-size: 2.25rem;
  font-weight: 600;
}

.container {
  display: flex;
  flex-direction: column;
}

.notes-container h2 {
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0.75rem;
  color: var(--color-text);
  font-weight: 600;
}

.note-item.new-note {
  background-color: var(--color-card);
  border: 2px dashed var(--color-border);
  border-radius: 0.75rem;
  padding: 1.75rem;
  margin-bottom: 3rem;
  transition: all 0.3s ease;
}

.note-item.new-note:hover {
  border-color: var(--color-primary);
  box-shadow: 0 3px 10px var(--color-shadow);
}

.note-title-input, .note-content-input, .tag-input {
  width: 98.5%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.7);
  color: var(--color-text);
}

.note-title-input {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.note-content-input {
  min-height: 100px;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
  font-family: inherit;
}

.tags-input-container {
  margin-bottom: 1rem;
}

.tag-input-wrapper {
  margin: 0.5rem 0;
}

.tag-input {
  font-size: 1rem;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-item, .tag-filter {
  border-radius: 2rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

.tag-item {
  background-color: var(--color-primary);
  color: white;
}

.tag-filter {
  background-color: #e0e0e0;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-filter:hover {
  background-color: #ccc;
}

.tag-filter.active {
  background-color: var(--color-primary);
  color: white;
}

.tag-remove, .tag-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
  justify-content: center;
  line-height: 1;
}

.tag-remove {
  color: white;
  margin-left: 0.25rem;
}

.tag-delete {
  margin-left: 0.5rem;
}

.tag-delete:hover {
  font-weight: bold;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn {
  cursor: pointer;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-button-text);
}

.btn-primary:hover {
  background-color: #ff9800;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.editing-form {
  margin-bottom: 2rem;
}

.tags-filter-container {
  margin: 2rem 0;
  padding: 1rem;
  background-color: var(--color-card);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px var(--color-shadow);
}

.tags-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tags-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.btn-clear-filter {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .active-notes-view {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .note-item.new-note {
    padding: 1rem;
  }
}
</style>
