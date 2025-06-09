import axios from 'axios';

/**
 * API Configuration with Security Best Practices
 * Uses environment variables for configuration
 * Fallback to public Rick and Morty API if env var not set
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rickandmortyapi.com/api';

// Validate API URL format for security
const isValidUrl = (url) => {
  try {
    new URL(url);
    return url.startsWith('https://') || url.startsWith('http://localhost');
  } catch {
    return false;
  }
};

if (!isValidUrl(API_BASE_URL)) {
  console.error('Invalid API URL detected. Using default public API.');
}

const api = axios.create({
  baseURL: isValidUrl(API_BASE_URL) ? API_BASE_URL : 'https://rickandmortyapi.com/api',
  timeout: 10000, // 10 second timeout for security
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCharacters = async (page = 1, filters = {}) => {
  try {
    // Boş filtreleri temizle
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await api.get('/character', {
      params: {
        page,
        ...cleanFilters,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // Karakter bulunamadığında boş sonuç döndür
      return {
        info: { count: 0, pages: 0 },
        results: []
      };
    }
    throw error;
  }
};

export const getCharacterById = async (id) => {
  try {
    const response = await api.get(`/character/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
