import { createSlice } from '@reduxjs/toolkit';

const recordSlice = createSlice({
  name: 'record',
  initialState: {
    record: [],   // Danh sách
    loading: false  // Trạng thái loading
  },

  reducers: {
    addRecord: (state, action) => {
      state.messages.push(action.payload);
    },

    
  },
});

export const {
  addRecord
  
} = recordSlice.actions;

export default recordSlice.reducer;
