import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  notification: null,
  theme: 'light',
  sidebarOpen: true,
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showNotification: (state, action) => {
      state.notification = {
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
  },
});

export const {
  setLoading,
  showNotification,
  clearNotification,
  toggleTheme,
  toggleSidebar,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
