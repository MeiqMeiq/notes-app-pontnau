import axios from 'axios';

// Determinar la URL base de la API según el entorno
const apiBaseUrl = import.meta.env.PROD 
  ? 'https://notes-app-pontnau.vercel.app/api' 
  : 'http://localhost:8000';

// Cliente API con configuración base
const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Servicios de notas simplificados
export default {
  // Obtener notas
  getActiveNotes: (tag = null) => {
    const url = tag ? `/notes?tag=${tag}` : '/notes';
    return apiClient.get(url);
  },
  getArchivedNotes: (tag = null) => {
    const url = tag ? `/notes/archived?tag=${tag}` : '/notes/archived';
    return apiClient.get(url);
  },
  getNote: (id) => apiClient.get(`/notes/${id}`),
  
  // Operaciones CRUD
  createNote: (note) => apiClient.post('/notes', note),
  updateNote: (id, note) => apiClient.put(`/notes/${id}`, note),
  deleteNote: (id) => {
    const url = `/notes/${id}`;
    return apiClient.delete(url)
      .then(response => {
        return response;
      })
      .catch(error => {
        console.error('Error al eliminar nota:', error);
        throw error;
      });
  },
  
  // Acciones especiales
  archiveNote: (id) => apiClient.patch(`/notes/${id}/archive`),
  unarchiveNote: (id) => apiClient.patch(`/notes/${id}/unarchive`),
  
  // Para fijar y desfijar notas - actualiza solo el campo is_pinned
  pinNote: (id) => {
    // Como el backend podría no tener un endpoint específico para fijar notas,
    // usamos el update con un campo específico
    return apiClient.put(`/notes/${id}`, { is_pinned: true });
  },
  unpinNote: (id) => {
    return apiClient.put(`/notes/${id}`, { is_pinned: false });
  },
  
  // Servicios de tags
  getAllTags: () => apiClient.get('/tags'),
  createTag: (tag) => apiClient.post('/tags', tag),
  getNotesByTag: (tagName) => apiClient.get(`/notes/by-tag/${tagName}`),
  deleteTag: (tagId) => apiClient.delete(`/tags/${tagId}`),
  
  // Eliminar una etiqueta de una nota
  removeTagFromNote: (noteId, tagName) => {
    // Este endpoint debería implementarse en el backend para eliminar una etiqueta específica de una nota
    // Si no existe, podríamos buscar la nota, modificar sus etiquetas y usar el endpoint de actualización
    return apiClient.put(`/notes/${noteId}/remove-tag`, { tag_name: tagName });
  }
}; 