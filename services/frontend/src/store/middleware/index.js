// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { paragraphMiddleware } from './middleware/paragraph';

// ... existing imports and configs ...

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    ui: persistedUiReducer,
    users: userReducer,
    profile: profileReducer,
    dailySchedule: useDailyScheduleSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(paragraphMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
