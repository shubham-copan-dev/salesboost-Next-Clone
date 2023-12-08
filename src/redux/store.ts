import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./slices";

const store = configureStore({
  reducer: rootReducer,
  // devTools: import.meta.env.MODE !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
