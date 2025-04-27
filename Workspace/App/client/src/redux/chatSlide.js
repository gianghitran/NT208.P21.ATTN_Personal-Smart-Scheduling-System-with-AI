import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],   // Danh sách tin nhắn
    loading: false  // Trạng thái loading
  },

  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    
  },
});

export const {
  addMessage
  
} = chatSlice.actions;

export default chatSlice.reducer;
