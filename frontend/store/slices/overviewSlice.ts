import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OverviewCardType = 
  | 'Unique Users'
  | 'Pageviews'
  | 'Sessions'
  | 'Pages per Session'
  | 'Bounce Rate'
  | 'Session Duration';

interface OverviewState {
  selectedCard: OverviewCardType;
}

const initialState: OverviewState = {
  selectedCard: 'Unique Users',
};

const overviewSlice = createSlice({
  name: 'overview',
  initialState,
  reducers: {
    setSelectedCard: (state, action: PayloadAction<OverviewCardType>) => {
      state.selectedCard = action.payload;
    },
  },
});

export const { setSelectedCard } = overviewSlice.actions;
export default overviewSlice.reducer;
