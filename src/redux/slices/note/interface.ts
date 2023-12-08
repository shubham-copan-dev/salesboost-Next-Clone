export declare interface NoteInterface {
  _id: string;
  user: string[];
  sfObject: string;
  record: string;
  heading: string;
  description: string;
  content: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
}

export declare interface NotesState {
  notes: NoteInterface[] | null;
}
