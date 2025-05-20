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
  },
  // Añadir timeouts para evitar operaciones eternamente pendientes
  timeout: 10000,
});

// Aplicar interceptores para mejor manejo de errores y caché
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Log de errores consistente
    console.error('Error en la petición API:', error.message);
    return Promise.reject(error);
  }
);

// Cache simple para requests GET
const cache = {
  data: new Map(),
  timeout: 60000, // 1 minuto en ms
  get(key) {
    const item = this.data.get(key);
    if (!item) return null;
    
    const now = Date.now();
    if (now > item.expiry) {
      this.data.delete(key);
      return null;
    }
    
    return item.value;
  },
  set(key, value) {
    const expiry = Date.now() + this.timeout;
    this.data.set(key, { value, expiry });
  },
  invalidate(pattern) {
    // Invalidar entradas que coincidan con el patrón
    for (const key of this.data.keys()) {
      if (key.includes(pattern)) {
        this.data.delete(key);
      }
    }
  }
};

// Función auxiliar para generar una clave de caché
const getCacheKey = (url, params) => {
  return `${url}|${JSON.stringify(params || {})}`;
};

// Servicios de notas mejorados
export default {
  // Obtener notas (con caché)
  getActiveNotes: async (tag = null) => {
    const url = tag ? `/api/notes?tag=${tag}` : '/api/notes';
    const cacheKey = getCacheKey(url);
    
    // Para notas sin filtro, siempre obtener datos frescos
    if (!tag) {
      const response = await apiClient.get(url);
      cache.set(cacheKey, response.data);
      return response;
    }
    
    // Para filtros, verificar caché primero
    const cachedData = cache.get(cacheKey);
    if (cachedData) return { data: cachedData };
    
    const response = await apiClient.get(url);
    cache.set(cacheKey, response.data);
    return response;
  },
  
  getArchivedNotes: async (tag = null) => {
    const url = tag ? `/api/notes/archived?tag=${tag}` : '/api/notes/archived';
    const cacheKey = getCacheKey(url);
    
    // Verificar caché primero
    const cachedData = cache.get(cacheKey);
    if (cachedData) return { data: cachedData };
    
    const response = await apiClient.get(url);
    cache.set(cacheKey, response.data);
    return response;
  },
  
  getNote: async (id) => {
    const url = `/api/notes/${id}`;
    const cacheKey = getCacheKey(url);
    
    // Verificar caché primero
    const cachedData = cache.get(cacheKey);
    if (cachedData) return { data: cachedData };
    
    const response = await apiClient.get(url);
    cache.set(cacheKey, response.data);
    return response;
  },
  
  // Operaciones CRUD (sin caché, pero invalidando caché)
  createNote: async (note) => {
    const response = await apiClient.post('/api/notes', note);
    // Invalidar caché relacionada
    cache.invalidate('/api/notes');
    cache.invalidate('/api/tags');
    return response;
  },
  
  updateNote: async (id, note) => {
    const response = await apiClient.put(`/api/notes/${id}`, note);
    // Invalidar caché relacionada
    cache.invalidate('/api/notes');
    cache.invalidate(`/api/notes/${id}`);
    cache.invalidate('/api/tags');
    return response;
  },
  
  deleteNote: async (id) => {
    try {
      const response = await apiClient.delete(`/api/notes/${id}`);
      // Invalidar caché relacionada
      cache.invalidate('/api/notes');
      cache.invalidate(`/api/notes/${id}`);
      return response;
    } catch (error) {
      console.error('Error al eliminar nota:', error);
      throw error;
    }
  },
  
  // Acciones especiales
  archiveNote: async (id) => {
    const response = await apiClient.patch(`/api/notes/${id}/archive`);
    // Invalidar caché
    cache.invalidate('/api/notes');
    cache.invalidate('/api/notes/archived');
    return response;
  },
  
  unarchiveNote: async (id) => {
    const response = await apiClient.patch(`/api/notes/${id}/unarchive`);
    // Invalidar caché
    cache.invalidate('/api/notes');
    cache.invalidate('/api/notes/archived');
    return response;
  },
  
  // Para fijar y desfijar notas - actualiza solo el campo is_pinned
  pinNote: async (id) => {
    const response = await apiClient.put(`/api/notes/${id}`, { is_pinned: true });
    // Invalidar caché relacionada
    cache.invalidate('/api/notes');
    return response;
  },
  
  unpinNote: async (id) => {
    const response = await apiClient.put(`/api/notes/${id}`, { is_pinned: false });
    // Invalidar caché relacionada
    cache.invalidate('/api/notes');
    return response;
  },
  
  // Servicios de tags
  getAllTags: async () => {
    const url = '/api/tags';
    const cacheKey = getCacheKey(url);
    
    // Verificar caché
    const cachedData = cache.get(cacheKey);
    if (cachedData) return { data: cachedData };
    
    const response = await apiClient.get(url);
    cache.set(cacheKey, response.data);
    return response;
  },
  
  createTag: async (tag) => {
    const response = await apiClient.post('/api/tags', tag);
    // Invalidar caché
    cache.invalidate('/api/tags');
    return response;
  },
  
  getNotesByTag: async (tagName) => {
    const url = `/api/notes/by-tag/${tagName}`;
    const cacheKey = getCacheKey(url);
    
    // Verificar caché
    const cachedData = cache.get(cacheKey);
    if (cachedData) return { data: cachedData };
    
    const response = await apiClient.get(url);
    cache.set(cacheKey, response.data);
    return response;
  },
  
  deleteTag: async (id) => {
    const response = await apiClient.delete(`/api/tags/${id}`);
    // Invalidar caché relacionada
    cache.invalidate('/api/tags');
    cache.invalidate('/api/notes'); // También invalidar notas ya que pueden cambiar
    return response;
  },
  
  // Eliminar una etiqueta de una nota
  removeTagFromNote: async (noteId, tagName) => {
    const response = await apiClient.put(`/api/notes/${noteId}/remove-tag`, { tag_name: tagName });
    // Invalidar caché relacionada
    cache.invalidate('/api/notes');
    cache.invalidate(`/api/notes/${noteId}`);
    return response;
  }
};  