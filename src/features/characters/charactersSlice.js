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
  },
});

export const {
  setCharacters,
  setSelectedCharacter,
  setLoading,
  setError,
  setFilters,
  setPagination,
} = charactersSlice.actions;

export default charactersSlice.reducer; 