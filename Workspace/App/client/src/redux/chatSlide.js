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

   

    loadMoreMessages: (state, action) => {
      const oldMessages = action.payload;
      state.messages = [...oldMessages, ...state.messages];
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

  },
});

export const {
  addMessage,
  loadMoreMessages,
  setLoading,
} = chatSlice.actions;

export default chatSlice.reducer;
