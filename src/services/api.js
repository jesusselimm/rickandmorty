import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
