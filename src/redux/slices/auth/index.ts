import { createSlice } from '@reduxjs/toolkit';

import { AuthState } from './interface';

// initial state
const initialState = {
  user: null,
} as AuthState;

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(init, action) {
      const state = init;
      state.user = action.payload;
    },
    updateUser(init, action) {
      const state = init;
      state.user = { ...state.user, ...action.payload };
    },
  },
});

// reducers exports
export const { setUser, updateUser } = AuthSlice.actions;

export default AuthSlice.reducer;
