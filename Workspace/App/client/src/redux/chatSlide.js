import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],   // Danh sách tin nhắn
    loading: false  // Trạng thái loading
  },

  reducers: {
    // Thêm một message mới vào danh sách
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    // Cập nhật trạng thái của message (ví dụ: từ sending → sent)
    updateMessageStatus: (state, action) => {
      const { id, status } = action.payload;
      const msg = state.messages.find((m) => m.id === id);
      if (msg) {
        msg.status = status;
      }
    },

    // Load thêm messages cũ (append vào đầu danh sách)
    loadMoreMessages: (state, action) => {
      const oldMessages = action.payload;
      state.messages = [...oldMessages, ...state.messages];
    },

    // Bật hoặc tắt trạng thái loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Xóa toàn bộ messages (clear chat)
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
