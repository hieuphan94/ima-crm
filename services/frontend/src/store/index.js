import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// Thêm các reducers khác nếu có

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Thêm các reducers khác
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
