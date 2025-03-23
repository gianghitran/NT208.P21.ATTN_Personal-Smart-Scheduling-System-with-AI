const ChatHistory = require("../../Models/ChatHistory"); // Model lưu lịch sử chat
require("dotenv").config(); // Đọc biến môi trường từ .env

// Hàm lưu tin nhắn vào database
exports.saveMessage = async (req, res) => {
    try {
        const { userId, message, botReply } = req.body;
        if (!userId || !message || !botReply) {
            return res.status(400).json({ error: "Missing userId, message, or botReply" });
        }

        console.log("Get message:", message);
        console.log("Resposnse from chatbot:", botReply);

        // Tìm lịch sử chat của user
        let chatHistory = await ChatHistory.findOne({ userId });
        if (!chatHistory) {
            chatHistory = new ChatHistory({ userId, messages: [] });
        }

        // Lưu tin nhắn của user và phản hồi của bot
        chatHistory.messages.push({ role: "user", content: message });
        chatHistory.messages.push({ role: "assistant", content: botReply });

        // Giới hạn lịch sử chat tối đa 10 tin nhắn
        if (chatHistory.messages.length > 30) {
            chatHistory.messages = chatHistory.messages.slice(-30);
        }

        // Lưu vào MongoDB
        await chatHistory.save();

        res.status(200).json({ message: "Chat history updated successfully", history: chatHistory.messages });
    } catch (error) {
        console.error("❌ Lỗi trong saveMessage:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Hàm lấy lịch sử chat của user
exports.getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        console.log("Get chat history from user:", userId);

        const chatHistory = await ChatHistory.findOne({ userId });

        res.status(200).json({ history: chatHistory ? chatHistory.messages : [] });
    } catch (error) {
        console.error("❌ Lỗi trong getChatHistory:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
