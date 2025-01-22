import { configureStore } from '@reduxjs/toolkit';
import { createTransform, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import uiReducer from './slices/uiSlice';
import useDailyScheduleSlice from './slices/useDailyScheduleSlice';
import userReducer from './slices/userSlice';

let persistStorage;

// Xử lý SSR
if (typeof window === 'undefined') {
  const createNoopStorage = () => {
    return {
      getItem() {
        return Promise.resolve(null);
      },
      setItem() {
        return Promise.resolve();
      },
      removeItem() {
        return Promise.resolve();
      },
    };
  };
  persistStorage = createNoopStorage();
} else {
  persistStorage = storage;
}

// Transform để xử lý dữ liệu trước khi persist
const persistTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState) => {
    return inboundState;
  },
  // transform state being rehydrated
  (outboundState) => {
    return outboundState;
  }
);

const authPersistConfig = {
  key: 'auth',
  storage: persistStorage,
  whitelist: ['user', 'token', 'isAuthenticated'],
  transforms: [persistTransform],
};

const uiPersistConfig = {
  key: 'ui',
  storage: persistStorage,
  whitelist: ['theme', 'sidebarOpen'],
  transforms: [persistTransform],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUiReducer = persistReducer(uiPersistConfig, uiReducer);

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
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
