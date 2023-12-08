import { createSlice } from '@reduxjs/toolkit';

import { SalesForceState } from './interface';

// initial state
const initialState = {
  gridTabs: null,
  panelView: 'grid',
  columnMeta: null,
  records: null,
  allFields: null,
  viewByMeta: null,
  selectedViewBy: 'all',
  selectedRows: null,
  createRecordPopup: false,
  fieldUpdateMode: 'instant',
  editedFields: null,
  limit: 20,
  reFetchTabs: 1,
  reFetchViewBy: 1,
} as SalesForceState;

const SalesForceSlice = createSlice({
  name: 'salesForce',
  initialState,
  reducers: {
    setGridTabs(init, action) {
      const state = init;
      state.gridTabs = action.payload;
    },
    deleteGridTabs(init, action) {
      const state = init;
      if (state.gridTabs) {
        const copyTabs = [...state.gridTabs];
        const index = copyTabs?.findIndex((fi) => fi?._id === action.payload);
        copyTabs?.splice(index, 1);
        state.gridTabs = copyTabs;
      }
    },
    updateGridTabs(init, action) {
      const state = init;
      if (state.gridTabs) {
        const copyTabs = [...state.gridTabs];
        const index = copyTabs?.findIndex((fi) => fi?._id === action.payload?._id);
        copyTabs?.splice(index, 1, action.payload);
        state.gridTabs = copyTabs;
      }
    },

    setPanelView(init, action) {
      const state = init;
      state.panelView = action.payload;
    },

    setColumnMeta(init, action) {
      const state = init;
      state.columnMeta = action.payload;
    },
    updateColumnMeta(init, action) {
      const state = init;
      if (state.columnMeta) {
        const copyColumns = [...state.columnMeta];
        const index = copyColumns?.findIndex((fi) => fi?.name === action.payload?.name);
        copyColumns?.splice(index, 1, action.payload);
        state.columnMeta = copyColumns;
      }
    },

    setRecords(init, action) {
      const state = init;
      state.records = action.payload;
    },
    deleteRecord(init, action) {
      const state = init;
      if (state.records) {
        const copyRecords = [...state.records];
        const index = copyRecords?.findIndex((fi) => fi?.Id === action.payload);
        copyRecords?.splice(index, 1);
        state.records = copyRecords;
      }
    },
    updateRecord(init, action) {
      const state = init;
      if (state.records) {
        const newRecords = [...state.records];
        const indexOfRecord = newRecords?.findIndex((item) => item?.Id === action.payload?.Id);
        newRecords.splice(indexOfRecord, 1, action.payload);
        state.records = newRecords;
      }
    },
    updateMultipleRecords(init, action) {
      const state = init;
      if (state.records) {
        const newRecords = state.records?.map((item) => {
          if (action?.payload?.ids?.includes(item?.Id)) {
            return { ...item, ...action.payload.fields };
          }
          return item;
        });
        state.records = newRecords;
      }
    },
    setAllFields(init, action) {
      const state = init;
      state.allFields = action.payload;
    },

    setViewByMeta(init, action) {
      const state = init;
      state.viewByMeta = action.payload;
    },
    setSelectedViewBy(init, action) {
      const state = init;
      state.selectedViewBy = action.payload;
    },
    deleteViewByMeta(init, action) {
      const state = init;
      if (state.viewByMeta) {
        const copyMeta = [...state.viewByMeta];
        const index = copyMeta?.findIndex((fi) => fi?._id === action.payload);
        copyMeta?.splice(index, 1);
        state.viewByMeta = copyMeta;
      }
    },
    updateViewByMeta(init, action) {
      const state = init;
      if (state.viewByMeta) {
        const copyViews = [...state.viewByMeta];
        const indexOfRecord = copyViews?.findIndex((item) => item?._id === action.payload?._id);
        copyViews.splice(indexOfRecord, 1, action.payload);
        state.viewByMeta = copyViews;
      }
    },
    pushToViewBy(init, action) {
      const state = init;
      state.viewByMeta?.push(action?.payload);
    },
    setReFetchViewBy(init) {
      const state = init;
      state.reFetchViewBy = state.reFetchViewBy + 1;
    },

    setSelectedRows(init, action) {
      const state = init;
      state.selectedRows = action.payload;
    },

    setCreateRecordPopup(init, action) {
      const state = init;
      state.createRecordPopup = action.payload;
    },

    setFieldUpdateMode(init, action) {
      const state = init;
      state.fieldUpdateMode = action.payload;
    },
    setEditedFields(init, action) {
      const state = init;
      if (state.editedFields && action?.payload) {
        const recordExist = state.editedFields?.find((item) => item?.id === action?.payload?.id);
        if (recordExist) {
          const copied = [...state.editedFields];
          const index = copied?.findIndex((item) => item?.id === action?.payload?.id);
          const record = { ...recordExist, ...action.payload };
          copied?.splice(index, 1, record);
          state.editedFields = copied;
        } else {
          const copied = [...state.editedFields];
          copied?.push(action?.payload);
          state.editedFields = copied;
        }
      } else {
        state.editedFields = action.payload ? [action.payload] : action.payload;
      }
    },

    setLimit(init, action) {
      const state = init;
      state.limit = action.payload;
    },
    setReFetchTabs(init) {
      const state = init;
      state.reFetchTabs = state.reFetchTabs + 1;
    },
  },
});

// reducers exports
export const {
  setGridTabs,
  deleteGridTabs,
  updateGridTabs,
  setPanelView,
  setColumnMeta,
  updateColumnMeta,
  setRecords,
  deleteRecord,
  updateRecord,
  setAllFields,
  setViewByMeta,
  setSelectedViewBy,
  deleteViewByMeta,
  updateViewByMeta,
  pushToViewBy,
  setReFetchViewBy,
  setSelectedRows,
  updateMultipleRecords,
  setCreateRecordPopup,
  setFieldUpdateMode,
  setEditedFields,
  setLimit,
  setReFetchTabs,
} = SalesForceSlice.actions;

export default SalesForceSlice.reducer;
