import axios from 'axios';

// Determinar la URL base de la API según el entorno
const apiBaseUrl = import.meta.env.PROD 
  ? '' // En producción, las rutas relativas funcionarán correctamente con el proxy de Vercel
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
    const url = tag ? `/api/notes?tag=${tag}` : '/api/notes';
    return apiClient.get(url);
  },
  getArchivedNotes: (tag = null) => {
    const url = tag ? `/api/notes/archived?tag=${tag}` : '/api/notes/archived';
    return apiClient.get(url);
  },
  getNote: (id) => apiClient.get(`/api/notes/${id}`),
  
  // Operaciones CRUD
  createNote: (note) => apiClient.post('/api/notes', note),
  updateNote: (id, note) => apiClient.put(`/api/notes/${id}`, note),
  deleteNote: (id) => {
    const url = `/api/notes/${id}`;
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
  archiveNote: (id) => apiClient.patch(`/api/notes/${id}/archive`),
  unarchiveNote: (id) => apiClient.patch(`/api/notes/${id}/unarchive`),
  
  // Para fijar y desfijar notas - actualiza solo el campo is_pinned
  pinNote: (id) => {
    // Como el backend podría no tener un endpoint específico para fijar notas,
    // usamos el update con un campo específico
    return apiClient.put(`/api/notes/${id}`, { is_pinned: true });
  },
  unpinNote: (id) => {
    return apiClient.put(`/api/notes/${id}`, { is_pinned: false });
  },
  
  // Servicios de tags
  getAllTags: () => apiClient.get('/api/tags'),
  createTag: (tag) => apiClient.post('/api/tags', tag),
  getNotesByTag: (tagName) => apiClient.get(`/api/notes/by-tag/${tagName}`),
  deleteTag: (id) => apiClient.delete(`/api/tags/${id}`),
  
  // Eliminar una etiqueta de una nota
  removeTagFromNote: (noteId, tagName) => {
    // Este endpoint debería implementarse en el backend para eliminar una etiqueta específica de una nota
    // Si no existe, podríamos buscar la nota, modificar sus etiquetas y usar el endpoint de actualización
    return apiClient.put(`/api/notes/${noteId}/remove-tag`, { tag_name: tagName });
  }
};  