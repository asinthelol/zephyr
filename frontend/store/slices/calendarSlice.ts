import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CalendarState {
  selectedDate: string; // ISO string
  selectedTimeframe: string;
}

const initialState: CalendarState = {
  selectedDate: new Date().toISOString(),
  selectedTimeframe: 'today',
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setSelectedTimeframe: (state, action: PayloadAction<string>) => {
      state.selectedTimeframe = action.payload;
    },
  },
});

export const { setSelectedDate, setSelectedTimeframe } = calendarSlice.actions;
export default calendarSlice.reducer;
