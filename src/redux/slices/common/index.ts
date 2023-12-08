import { createSlice } from '@reduxjs/toolkit';

import { CommonState } from './interface';

// initial state
const initialState = {
  fullscreen: false,
} as CommonState;

const CommonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setFullscreen(init, action) {
      const state = init;
      state.fullscreen = action.payload;
    },
  },
});

// reducers exports
export const { setFullscreen } = CommonSlice.actions;

export default CommonSlice.reducer;
