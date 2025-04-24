const initialState = {
    messages: [], // Danh sách tin nhắn
    loading: false, // Trạng thái tải dữ liệu (nếu có)
    hasMore: true, // Trạng thái có thêm tin nhắn hay không
  };
  
  const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const newMessage = {
              ...action.payload,
              status: action.payload.status || 'sending', // 👈 chỉ mặc định nếu không có
            };
            state.messages.push(newMessage);
          },
          
      setMessages: (state, action) => {
        const newMessages = action.payload;
        state.messages = newMessages.length > 30 ? newMessages.slice(-30) : newMessages;
        state.hasMore = newMessages.length === 30;
      },
      loadMoreMessages: (state, action) => {
        const oldMessages = action.payload;
        state.messages = [...oldMessages, ...state.messages];
        state.hasMore = oldMessages.length > 0;
      },
      updateMessageStatus: (state, action) => {
        const { id, status } = action.payload;
        const msg = state.messages.find(m => m.id === id);
        if (msg) msg.status = status;
      },
      setLoading: (state, action) => {
        // Cập nhật trạng thái loading
        state.loading = action.payload;
      },
    },
  });
  export const { addMessage, setMessages, setLoading, loadMoreMessages, updateMessageStatus } = chatSlice.actions;

  export default chatSlice.reducer;