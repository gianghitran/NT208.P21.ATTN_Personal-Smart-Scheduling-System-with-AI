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

    updateMessageStatus: (state, action) => {
      const { id, status } = action.payload;
      const msg = state.messages.find((m) => m.id === id);
      if (msg) {
        msg.status = status;
      }
    },

    loadMoreMessages: (state, action) => {
      const oldMessages = action.payload;
      state.messages = [...oldMessages, ...state.messages];
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  addMessage,
  updateMessageStatus,
  loadMoreMessages,
  setLoading,
  clearMessages
} = chatSlice.actions;

export default chatSlice.reducer;
