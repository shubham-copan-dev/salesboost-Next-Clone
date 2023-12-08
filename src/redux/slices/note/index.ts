import { createSlice } from '@reduxjs/toolkit';

import { NotesState } from './interface';

// initial state
const initialState = {
  notes: null,
} as NotesState;

const NoteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes(init, action) {
      const state = init;
      state.notes = action.payload;
    },
    pushToNotes(init, action) {
      const state = init;
      state.notes?.push(action.payload);
    },
    updateNote(init, action) {
      const state = init;
      if (state.notes) {
        const copyNotes = [...state.notes];
        const index = copyNotes?.findIndex((fi) => fi?._id === action.payload?._id);
        copyNotes?.splice(index, 1, action.payload);
        state.notes = copyNotes;
      }
    },
    deleteNote(init, action) {
      const state = init;
      if (state.notes) {
        const copyNotes = [...state.notes];
        const index = copyNotes?.findIndex((fi) => fi?._id === action.payload);
        copyNotes?.splice(index, 1);
        state.notes = copyNotes;
      }
    },
  },
});

// reducers exports
export const { setNotes, deleteNote, updateNote, pushToNotes } = NoteSlice.actions;

export default NoteSlice.reducer;
