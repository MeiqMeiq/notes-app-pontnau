import { defineStore } from 'pinia';
import noteService from '../services/noteService';

export const useNotesStore = defineStore('notes', {
  state: () => ({
    activeNotes: [],
    archivedNotes: [],
    isLoading: false,
    error: null
  }),
  
  getters: {
    // Ordenar notas para que las fijadas aparezcan primero
    sortedActiveNotes(state) {
      return [...state.activeNotes].sort((a, b) => {
        // Si ambas están fijadas o ambas no están fijadas, ordenar por fecha
        if (a.is_pinned === b.is_pinned) {
          return new Date(b.updated_at) - new Date(a.updated_at);
        }
        // Si solo una está fijada, ésta va primero
        return a.is_pinned ? -1 : 1;
      });
    }
  },
  
  actions: {
    // Método auxiliar para manejar estados de carga y errores
    async executeAction(actionFn) {
      this.isLoading = true;
      this.error = null;
      try {
        return await actionFn();
      } catch (error) {
        this.error = error.message || 'Error en la operación';
        console.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Cargar Notas Actuales
    async fetchActiveNotes(tagName = null) {
      return this.executeAction(async () => {
        const response = await noteService.getActiveNotes(tagName);
        this.activeNotes = response.data;
        return response.data;
      });
    },
    
    // Cargar notas archivadas
    async fetchArchivedNotes(tagName = null) {
      return this.executeAction(async () => {
        const response = await noteService.getArchivedNotes(tagName);
        this.archivedNotes = response.data;
        return response.data;
      });
    },
    
    // Crear una nueva nota
    async createNote(note) {
      return this.executeAction(async () => {
        const response = await noteService.createNote(note);
        
        if (!response || !response.data) {
          throw new Error('La respuesta del servidor no contiene datos');
        }
        
        this.activeNotes.unshift(response.data);
        return response.data;
      });
    },
    
    // Actualizar una nota
    async updateNote(id, note) {
      return this.executeAction(async () => {
        const response = await noteService.updateNote(id, note);
        
        const updateArray = response.data.is_archived ? this.archivedNotes : this.activeNotes;
        const index = updateArray.findIndex(n => n.id === id);
        
        if (index !== -1) {
          updateArray[index] = response.data;
        }
        
        return response.data;
      });
    },
    
    // Eliminar una nota
    async deleteNote(id) {
      if (!id || isNaN(Number(id))) {
        throw new Error('ID de nota inválido');
      }
      
      const noteId = Number(id);
      
      return this.executeAction(async () => {
        await noteService.deleteNote(noteId);
        
        this.activeNotes = this.activeNotes.filter(n => n.id !== noteId);
        this.archivedNotes = this.archivedNotes.filter(n => n.id !== noteId);
      });
    },
    
    // Archivar una nota
    async archiveNote(id) {
      return this.executeAction(async () => {
        const response = await noteService.archiveNote(id);
        
        const noteIndex = this.activeNotes.findIndex(n => n.id === id);
        if (noteIndex !== -1) {
          this.activeNotes.splice(noteIndex, 1);
          this.archivedNotes.push(response.data);
        }
        
        return response.data;
      });
    },
    
    // Desarchivar una nota
    async unarchiveNote(id) {
      return this.executeAction(async () => {
        const response = await noteService.unarchiveNote(id);
        
        const noteIndex = this.archivedNotes.findIndex(n => n.id === id);
        if (noteIndex !== -1) {
          this.archivedNotes.splice(noteIndex, 1);
          this.activeNotes.push(response.data);
        }
        
        return response.data;
      });
    },
    
    // Fijar una nota
    async pinNote(id) {
      return this.executeAction(async () => {
        const response = await noteService.pinNote(id);
        
        const index = this.activeNotes.findIndex(n => n.id === id);
        if (index !== -1) {
          this.activeNotes[index] = response.data;
        }
        
        return response.data;
      });
    },
    
    // Desfijar una nota
    async unpinNote(id) {
      return this.executeAction(async () => {
        const response = await noteService.unpinNote(id);
        
        const index = this.activeNotes.findIndex(n => n.id === id);
        if (index !== -1) {
          this.activeNotes[index] = response.data;
        }
        
        return response.data;
      });
    },
    
    // Eliminar etiqueta de una nota
    async removeTagFromNote(noteId, tagName) {
      return this.executeAction(async () => {
        const response = await noteService.removeTagFromNote(noteId, tagName);
        
        if (response.data.is_archived) {
          const index = this.archivedNotes.findIndex(n => n.id === noteId);
          if (index !== -1) {
            this.archivedNotes[index] = response.data;
          }
        } else {
          const index = this.activeNotes.findIndex(n => n.id === noteId);
          if (index !== -1) {
            this.activeNotes[index] = response.data;
          }
        }
        
        return response.data;
      });
    },
    
    // Eliminar una etiqueta completamente del sistema
    async deleteTag(tagId) {
      return this.executeAction(async () => {
        await noteService.deleteTag(tagId);
        
        await this.fetchActiveNotes();
        await this.fetchArchivedNotes();
        
        return true;
      });
    }
  }
}); 