import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  characters: [],
  selectedCharacter: null,
  loading: false,
  error: null,
  filters: {
    name: '',
    status: '',
    species: '',
    gender: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 0,
    pageSize: 20, // Default Rick and Morty API page size
  },
  sorting: {
    field: null, // Field to sort by (name, status, species, gender, etc.)
    direction: 'asc', // Sort direction (asc or desc)
  },
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setCharacters: (state, action) => {
      state.characters = action.payload;
    },
    setSelectedCharacter: (state, action) => {
      state.selectedCharacter = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSorting: (state, action) => {
      const { field } = action.payload;
      
      // If clicking same field, toggle direction
      if (state.sorting.field === field) {
        state.sorting.direction = state.sorting.direction === 'asc' ? 'desc' : 'asc';
      } else {
        // If clicking different field, set new field and default to asc
        state.sorting.field = field;
        state.sorting.direction = 'asc';
      }
    },
  },
});

export const {
  setCharacters,
  setSelectedCharacter,
  setLoading,
  setError,
  setFilters,
  setPagination,
  setSorting,
} = charactersSlice.actions;

export default charactersSlice.reducer; 