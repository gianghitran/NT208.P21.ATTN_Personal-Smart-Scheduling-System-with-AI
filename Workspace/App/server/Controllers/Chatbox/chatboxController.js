const ChatHistory = require("../../Models/ChatHistory"); // Model lưu lịch sử chat
require("dotenv").config(); // Đọc biến môi trường từ .env




exports.chatWithAI = async (req, res) => {
    try {
      const { messages } = req.body;
  
      if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }
  
      const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "BearCalendar",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // model: "openai/gpt-4o-mini-2024-07-18",
          // model :"openai/gpt-4o-mini",
          // model: "openai/gpt-3.5-turbo-1106",
            // model: "meta-llama/llama-3.3-8b-instruct:free",
            // model : "google/gemini-2.5-flash-preview-05-20",
            // # work mà ngu
            model:"qwen/qwen2.5-vl-32b-instruct:free", 

          messages,
        }),
      });
  
      if (!openRouterRes.ok) {
        throw new Error(`OpenRouter API failed with status ${openRouterRes.status}`);
      }
  
      const data = await openRouterRes.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error calling OpenRouter:", error.message);
      res.status(500).json({ error: "AI service error" });
    }
};

// Hàm lưu tin nhắn vào database
exports.saveMessage = async (req, res) => {
    try {
        const { userId, message, botReply } = req.body;
        if (!userId || !message || !botReply) {
            return res.status(400).json({ error: "Missing userId, message, or botReply" });
        }

        console.log("Get message:", message);
        console.log("Response from chatbot:", botReply);

        // Tìm lịch sử chat của user
        let chatHistory = await ChatHistory.findOne({ userId });
        if (!chatHistory) {
            chatHistory = new ChatHistory({ userId, messages: [] });
        }

        // Lưu tin nhắn của user và phản hồi của bot
        const formattedBotReply = `[Chat Reply:]\n${botReply}`;
        const formattedMessage = `[User Message:]\n${message}`;
        chatHistory.messages.push({ role: "assistant", content: formattedBotReply });
        chatHistory.messages.push({ role: "user", content: formattedMessage });

        // Giới hạn lịch sử chat tối đa 30 tin nhắn
        if (chatHistory.messages.length > 30) {
            chatHistory.messages = chatHistory.messages.slice(-30);
        }

        // Lưu vào MongoDB
        await chatHistory.save();

        res.status(200).json({ message: "Chat history updated successfully", history: chatHistory.messages });
    } catch (error) {
        console.error("Error when saveMessage:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Hàm lấy lịch sử chat của user
exports.getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "Missing User ID " });
        }


        const chatHistory = await ChatHistory.findOne({ userId });
        res.status(200).json({ history: chatHistory ? chatHistory.messages : [] });
        
        console.log("Get chat history from user:", userId);
        // console.log("Get chat history:", chatHistory ? chatHistory.messages : []);
      } catch (error) {
        console.error("Error in getChatHistory:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
