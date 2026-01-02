import { configureStore } from '@reduxjs/toolkit';
import appReducer from './features/appSlice';
import specialistsReducer from './slices/specialistsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      specialists: specialistsReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
