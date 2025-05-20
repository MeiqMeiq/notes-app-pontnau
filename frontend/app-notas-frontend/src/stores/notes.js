import { defineStore } from 'pinia';
import noteService from '../services/noteService';

export const useNotesStore = defineStore('notes', {
  state: () => ({
    activeNotes: [],
    archivedNotes: [],
    isLoading: false,
    error: null,
    lastUpdated: null, // Timestamp de la última actualización
    cacheTimeout: 60000, // 1 minuto en milisegundos
    pendingOperations: 0 // Contador de operaciones pendientes
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
    },
    
    // Determinar si se debe recargar desde el servidor
    shouldRefresh() {
      if (!this.lastUpdated) return true;
      return (Date.now() - this.lastUpdated) > this.cacheTimeout;
    }
  },
  
  actions: {
    // Método auxiliar para manejar estados de carga y errores
    async executeAction(actionFn) {
      this.pendingOperations++;
      this.isLoading = true;
      this.error = null;
      try {
        const result = await actionFn();
        this.lastUpdated = Date.now();
        return result;
      } catch (error) {
        this.error = error.message || 'Error en la operación';
        console.error(this.error);
        throw error;
      } finally {
        this.pendingOperations--;
        this.isLoading = this.pendingOperations > 0;
      }
    },

    // Cargar Notas Actuales
    async fetchActiveNotes(tagName = null) {
      // Usar caché si es posible y no hay una etiqueta específica
      if (!tagName && !this.shouldRefresh && this.activeNotes.length > 0) {
        return this.activeNotes;
      }
      
      return this.executeAction(async () => {
        const response = await noteService.getActiveNotes(tagName);
        this.activeNotes = response.data;
        return response.data;
      });
    },
    
    // Cargar notas archivadas
    async fetchArchivedNotes(tagName = null) {
      // Usar caché si es posible y no hay una etiqueta específica
      if (!tagName && !this.shouldRefresh && this.archivedNotes.length > 0) {
        return this.archivedNotes;
      }
      
      return this.executeAction(async () => {
        const response = await noteService.getArchivedNotes(tagName);
        this.archivedNotes = response.data;
        return response.data;
      });
    },
    
    // Crear una nueva nota (optimizada)
    async createNote(note) {
      return this.executeAction(async () => {
        // Crear una copia optimista de la nota
        const tempNote = { 
          ...note, 
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_archived: false,
          is_pinned: false
        };
        
        // Añadir al estado local primero para una respuesta inmediata
        this.activeNotes.unshift(tempNote);
        
        // Enviar al servidor
        const response = await noteService.createNote(note);
        
        if (!response || !response.data) {
          // Quitar la nota temporal si hay error
          this.activeNotes = this.activeNotes.filter(n => n.id !== tempNote.id);
          throw new Error('La respuesta del servidor no contiene datos');
        }
        
        // Reemplazar la nota temporal con la real
        const index = this.activeNotes.findIndex(n => n.id === tempNote.id);
        if (index !== -1) {
          this.activeNotes[index] = response.data;
        } else {
          this.activeNotes.unshift(response.data);
        }
        
        return response.data;
      });
    },
    
    // Actualizar una nota
    async updateNote(id, note) {
      return this.executeAction(async () => {
        // Actualizar optimistamente en la UI primero
        const updateArray = note.is_archived ? this.archivedNotes : this.activeNotes;
        const index = updateArray.findIndex(n => n.id === id);
        
        if (index !== -1) {
          // Guardar una copia antes de actualizar para restaurar en caso de error
          const prevNote = { ...updateArray[index] };
          
          // Actualizar localmente (optimista)
          updateArray[index] = { ...prevNote, ...note, updated_at: new Date().toISOString() };
          
          try {
            // Enviar al servidor
            const response = await noteService.updateNote(id, note);
            
            // Actualizar con la respuesta del servidor
            updateArray[index] = response.data;
            return response.data;
          } catch (error) {
            // Restaurar el estado anterior en caso de error
            updateArray[index] = prevNote;
            throw error;
          }
        } else {
          // Si no está en el array, proceder normalmente
          const response = await noteService.updateNote(id, note);
          return response.data;
        }
      });
    },
    
    // Eliminar una nota
    async deleteNote(id) {
      if (!id || isNaN(Number(id))) {
        throw new Error('ID de nota inválido');
      }
      
      const noteId = Number(id);
      
      return this.executeAction(async () => {
        // Eliminar optimistamente del estado
        const activeIndex = this.activeNotes.findIndex(n => n.id === noteId);
        const archivedIndex = this.archivedNotes.findIndex(n => n.id === noteId);
        
        // Guardar copias para restaurar en caso de error
        let removedActiveNote = null;
        let removedArchivedNote = null;
        
        if (activeIndex !== -1) {
          removedActiveNote = this.activeNotes[activeIndex];
          this.activeNotes.splice(activeIndex, 1);
        }
        
        if (archivedIndex !== -1) {
          removedArchivedNote = this.archivedNotes[archivedIndex];
          this.archivedNotes.splice(archivedIndex, 1);
        }
        
        try {
          await noteService.deleteNote(noteId);
        } catch (error) {
          // Restaurar notas en caso de error
          if (removedActiveNote) {
            this.activeNotes.push(removedActiveNote);
          }
          
          if (removedArchivedNote) {
            this.archivedNotes.push(removedArchivedNote);
          }
          
          throw error;
        }
      });
    },
    
    // Archivar una nota
    async archiveNote(id) {
      return this.executeAction(async () => {
        const noteIndex = this.activeNotes.findIndex(n => n.id === id);
        
        if (noteIndex !== -1) {
          // Guardar una copia de la nota
          const note = { ...this.activeNotes[noteIndex], is_archived: true };
          
          // Actualizar UI inmediatamente
          this.activeNotes.splice(noteIndex, 1);
          this.archivedNotes.push(note);
          
          // Enviar al servidor
          try {
            const response = await noteService.archiveNote(id);
            
            // Actualizar la nota en archivedNotes con datos del servidor
            const archivedIndex = this.archivedNotes.findIndex(n => n.id === id);
            if (archivedIndex !== -1) {
              this.archivedNotes[archivedIndex] = response.data;
            }
            
            return response.data;
          } catch (error) {
            // Revertir cambios en caso de error
            this.archivedNotes = this.archivedNotes.filter(n => n.id !== id);
            this.activeNotes.splice(noteIndex, 0, { ...note, is_archived: false });
            throw error;
          }
        } else {
          const response = await noteService.archiveNote(id);
          return response.data;
        }
      });
    },
    
    // Desarchivar una nota
    async unarchiveNote(id) {
      return this.executeAction(async () => {
        const noteIndex = this.archivedNotes.findIndex(n => n.id === id);
        
        if (noteIndex !== -1) {
          // Guardar una copia de la nota
          const note = { ...this.archivedNotes[noteIndex], is_archived: false };
          
          // Actualizar UI inmediatamente
          this.archivedNotes.splice(noteIndex, 1);
          this.activeNotes.push(note);
          
          try {
            const response = await noteService.unarchiveNote(id);
            
            // Actualizar la nota en activeNotes con datos del servidor
            const activeIndex = this.activeNotes.findIndex(n => n.id === id);
            if (activeIndex !== -1) {
              this.activeNotes[activeIndex] = response.data;
            }
            
            return response.data;
          } catch (error) {
            // Revertir cambios en caso de error
            this.activeNotes = this.activeNotes.filter(n => n.id !== id);
            this.archivedNotes.splice(noteIndex, 0, { ...note, is_archived: true });
            throw error;
          }
        } else {
          const response = await noteService.unarchiveNote(id);
          return response.data;
        }
      });
    },
    
    // Fijar una nota (optimizada)
    async pinNote(id) {
      return this.executeAction(async () => {
        const index = this.activeNotes.findIndex(n => n.id === id);
        
        if (index !== -1) {
          // Actualizar optimistamente en la UI primero
          this.activeNotes[index] = { ...this.activeNotes[index], is_pinned: true };
          
          try {
            const response = await noteService.pinNote(id);
            this.activeNotes[index] = response.data;
            return response.data;
          } catch (error) {
            // Revertir en caso de error
            this.activeNotes[index] = { ...this.activeNotes[index], is_pinned: false };
            throw error;
          }
        } else {
          const response = await noteService.pinNote(id);
          return response.data;
        }
      });
    },
    
    // Desfijar una nota (optimizada)
    async unpinNote(id) {
      return this.executeAction(async () => {
        const index = this.activeNotes.findIndex(n => n.id === id);
        
        if (index !== -1) {
          // Actualizar optimistamente en la UI primero
          this.activeNotes[index] = { ...this.activeNotes[index], is_pinned: false };
          
          try {
            const response = await noteService.unpinNote(id);
            this.activeNotes[index] = response.data;
            return response.data;
          } catch (error) {
            // Revertir en caso de error
            this.activeNotes[index] = { ...this.activeNotes[index], is_pinned: true };
            throw error;
          }
        } else {
          const response = await noteService.unpinNote(id);
          return response.data;
        }
      });
    },
    
    // Eliminar etiqueta de una nota (optimizada)
    async removeTagFromNote(noteId, tagName) {
      return this.executeAction(async () => {
        let noteArray = null;
        let noteIndex = -1;
        
        // Buscar la nota en el array correcto
        noteIndex = this.activeNotes.findIndex(n => n.id === noteId);
        if (noteIndex !== -1) {
          noteArray = this.activeNotes;
        } else {
          noteIndex = this.archivedNotes.findIndex(n => n.id === noteId);
          if (noteIndex !== -1) {
            noteArray = this.archivedNotes;
          }
        }
        
        if (noteArray && noteIndex !== -1) {
          // Guardar una copia de la nota original
          const originalNote = { ...noteArray[noteIndex] };
          
          // Actualizar optimistamente - quitar la etiqueta localmente
          const updatedTags = originalNote.tags.filter(tag => 
            typeof tag === 'object' ? tag.name !== tagName : tag !== tagName
          );
          
          noteArray[noteIndex] = { ...originalNote, tags: updatedTags };
          
          try {
            const response = await noteService.removeTagFromNote(noteId, tagName);
            noteArray[noteIndex] = response.data;
            return response.data;
          } catch (error) {
            // Revertir cambios en caso de error
            noteArray[noteIndex] = originalNote;
            throw error;
          }
        } else {
          const response = await noteService.removeTagFromNote(noteId, tagName);
          return response.data;
        }
      });
    },
    
    // Eliminar una etiqueta completamente del sistema (optimizada)
    async deleteTag(tagId) {
      return this.executeAction(async () => {
        try {
          // Hacer la solicitud para eliminar la etiqueta
          await noteService.deleteTag(tagId);
          
          // Actualizar localmente las notas que tienen esta etiqueta
          // Esta parte es opcional, pero mejora la experiencia del usuario
          // al evitar recargar todas las notas
          
          const removeTagFromNotes = (notesArray) => {
            return notesArray.map(note => {
              if (note.tags && note.tags.some(tag => tag.id === tagId)) {
                return {
                  ...note,
                  tags: note.tags.filter(tag => tag.id !== tagId)
                };
              }
              return note;
            });
          };
          
          this.activeNotes = removeTagFromNotes(this.activeNotes);
          this.archivedNotes = removeTagFromNotes(this.archivedNotes);
          
          return true;
        } catch (error) {
          throw error;
        }
      });
    }
  }
}); 