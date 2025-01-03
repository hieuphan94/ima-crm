import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  toast: {
    open: false,
    message: '',
    type: 'info', // 'success' | 'error' | 'info' | 'warning'
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toast = { ...action.payload, open: true };
    },
    hideToast: (state) => {
      state.toast.open = false;
    },
  },
});

export const { setLoading, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
