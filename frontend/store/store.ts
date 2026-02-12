import { configureStore } from '@reduxjs/toolkit';
import overviewReducer from './slices/overviewSlice';
import calendarReducer from './slices/calendarSlice';

export const store = configureStore({
  reducer: {
    overview: overviewReducer,
    calendar: calendarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
