import { configureStore } from '@reduxjs/toolkit';
import movies from './movies';

export const store = configureStore({
  reducer: {
    movies,
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
