/**
 * Funciones de utilidad para mejorar el rendimiento de la aplicación
 */

/**
 * Implementación de debounce para evitar llamadas repetitivas a funciones
 * @param {Function} func - La función a debounce
 * @param {number} wait - El tiempo en milisegundos a esperar
 * @param {boolean} immediate - Si ejecutar inmediatamente
 * @returns {Function} - Función con debounce
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Función para optimizar el renderizado en listas
 * @param {Array} items - Array de elementos
 * @param {string} propName - Nombre de la propiedad para generar clave única
 * @returns {Function} - Función generadora de claves únicas
 */
export function generateKey(items, propName = 'id') {
  const idMap = new Map();
  let counter = 0;
  
  return (item) => {
    const id = item[propName];
    
    if (!idMap.has(id)) {
      idMap.set(id, counter++);
    }
    
    return `${id}-${idMap.get(id)}`;
  };
}

/**
 * Implementación simplificada de memoize para funciones
 * @param {Function} fn - Función a memorizar
 * @returns {Function} - Función memorizada
 */
export function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
} 