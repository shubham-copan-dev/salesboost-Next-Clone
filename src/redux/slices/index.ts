import { combineReducers } from '@reduxjs/toolkit';

// slices imports
import AuthSlice from './auth';
import CommonSlice from './common';
import NoteSlice from './note';
import SalesForceSlice from './salesForce';

// combine reducer
const rootReducer = combineReducers({
  auth: AuthSlice,
  common: CommonSlice,
  sales: SalesForceSlice,
  note: NoteSlice,
});

export default rootReducer;
