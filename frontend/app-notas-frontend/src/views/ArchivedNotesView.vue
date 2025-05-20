<template>
  <div class="archived-notes-view">
    <div class="page-header">
      <h1>Notas Archivadas</h1>
    </div>
    
    <div class="container">
      <div class="notes-container">
        <h2>Mis Notas Archivadas</h2>
        <NoteList 
          :notes="notes" 
          :is-loading="isLoading"
          empty-message="No tienes notas archivadas. Las notas que archives aparecerán aquí."
          @unarchive="unarchiveNote"
          @delete="deleteNote"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useNotesStore } from '../stores/notes';
import NoteList from '../components/NoteList.vue';
import noteService from '../services/noteService';

export default {
  name: 'ArchivedNotesView',
  components: {
    NoteList
  },
  data() {
    return {
      allTags: [],
      selectedTag: null
    }
  },
  computed: {
    notes() {
      return this.notesStore.archivedNotes;
    },
    isLoading() {
      return this.notesStore.isLoading;
    }
  },
  created() {
    this.notesStore = useNotesStore();
    this.loadNotes();
  },
  methods: {
    async loadNotes() {
      await this.notesStore.fetchArchivedNotes();
    },
    
    async unarchiveNote(noteId) {
      try {
        await this.notesStore.unarchiveNote(noteId);
      } catch (error) {
        console.error('Error al desarchivar la nota:', error);
      }
    },
    
    async deleteNote(noteId) {
      if (!noteId) return;
      
      try {
        await this.notesStore.deleteNote(noteId);
      } catch (error) {
        console.error('Error al eliminar la nota:', error);
        alert('Error al eliminar la nota: ' + error.message);
      }
    }
  }
}
</script>

<style scoped>
.archived-notes-view {
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

.notes-container {
  margin-top: 1rem;
}

.notes-container h2 {
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0.75rem;
  color: var(--color-text);
  font-weight: 600;
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

.tag-filter {
  background-color: #e0e0e0;
  color: #333;
  border-radius: 2rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.tag-filter:hover {
  background-color: #ccc;
}

.tag-filter.active {
  background-color: var(--color-primary);
  color: white;
}

.tag-delete {
  background: none;
  border: none;
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
  justify-content: center;
  line-height: 1;
}

.tag-delete:hover {
  font-weight: bold;
}

@media (max-width: 768px) {
  .archived-notes-view {
    padding: 1rem;
  }
  
  .page-header h1 {
    font-size: 1.75rem;
  }
}
</style> 