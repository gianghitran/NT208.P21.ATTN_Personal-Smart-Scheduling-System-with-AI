import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import chatbox from './chatbox.module.css';
import { useSelector } from "react-redux";

const Chatbox = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);

  const userId = user?.userData._id; // Giả sử user đã đăng nhập, cần thay bằng user thực tế
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);

    
  // Hàm lấy lịch sử chat từ MongoDB khi người dùng mở chat
 // Hàm lấy lịch sử chat từ MongoDB
    const fetchChatHistory = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:4000/api/chatbox/send/${userId}`);
        const data = await response.json();
    
        if (Array.isArray(data.history)) {
          // Chỉ cập nhật nếu có tin nhắn mới, không ghi đè toàn bộ
          setMessages((prevMessages) => [...prevMessages, ...data.history]);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    // Gọi lịch sử chat khi component mount
    useEffect(() => {
      fetchChatHistory();
    }, [userId]);

  // Hàm gửi tin nhắn đến OpenRouter AI và lưu vào MongoDB
  const sendMessage = async () => {
    if (!input.trim()) {
      setMessages((prev) => [{ text: "Vui lòng nhập tin nhắn.", type: "error" }, ...prev]);
      return;
    }
  
    if (!userId) {
      setMessages((prev) => [{ text: "Vui lòng đăng nhập để chat!", type: "error" }, ...prev]);
      return;
    }
  
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  
    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;
    const userMessage = `[Question:]\n ${input}`;
  
    // Hiển thị tin nhắn của người dùng ngay lập tức
    const user_ask= `[Asking:]\n ${input}`;
    setMessages((prev) => [{ text: user_ask, type: "user" }, ...prev]);
    setInput("");
    setLoading(true);
  
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "mistral_24b_free",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
          messages: [{ role: "user", content: input }],
        }),
        signal,
      });
  
      if (!res.ok) {
        throw new Error(`API Error: ${res.status} - ${res.statusText}`);
      }
  
      const data = await res.json();
      const botReply = data.choices?.[0]?.message?.content || "Không có phản hồi.";
  
      // Cập nhật tin nhắn ngay lập tức trước khi gửi lên server
      setMessages((prev) => [
        { text: input, type: "user" },
        { text: DOMPurify.sanitize(botReply), type: "response" },
        ...prev,
      ]);
  
      // Gửi tin nhắn lên MongoDB
      await fetch(`http://localhost:4000/api/chatbox/history/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: userMessage, botReply }),
      });
    fetchChatHistory();
  
    } catch (error) {
      setMessages((prev) => [{ text: `Lỗi: ${error.message}`, type: "error" }, ...prev]);
    }
  
    setLoading(false);
  };

  // Hàm dừng chat
  const stopChat = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setLoading(false);
    setMessages((prev) => [{ text: "Chat stopped. You can ask another question.", type: "error" }, ...prev]);
  };

  return (
    <div className={chatbox.container}>
          {/* Tiêu đề động */}
          <div className={chatbox.title}>
            <motion.h1
              className="text-6xl font-bold"
              animate={{ backgroundPosition: "200% 0", opacity: [0.5, 1, 1.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{
                fontSize: "2rem",
                fontWeight: "900",
                background:
                  "linear-gradient(90deg, #ff4b2b,rgb(253, 126, 8),rgb(252, 213, 41))",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              [SMART] [Chatbox]<a></a>🔥To do list
            </motion.h1>
          </div>

          {/* Input và Button */}
          <div className={chatbox.form_group}>
            <input
              type="text"
              className={chatbox.form_control}
              placeholder="Enter your question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
          </div >
          <button className={chatbox.btnSuccess} onClick={sendMessage} disabled={loading}>
            {loading ? "Loading..." : "Ask!"}
          </button>
          <button className={chatbox.btnDanger} onClick={stopChat} disabled={!loading}>
            Stop
          </button>
          

          {/* Hiển thị phản hồi từ chatbot */}
          <div className={chatbox.response}>
              {messages.map((msg, index) => (
                //  <div key={index} className={`${chatbox.response_ans} ${msg.type}`}>
                <div key={index} className={`${chatbox.response_ans} ${chatbox[msg.type] || ""}`}>

                 <ReactMarkdown
                   components={{
                    pre: ({ children }) => <pre className={`${chatbox.code_block}`}>${children}</pre>,
                    code: ({ children }) => <code className={`${chatbox.inline_code}`}>{children}</code>

                   }}
                 >
                   {msg.text}
                 </ReactMarkdown>
               </div>
              ))}
            </div>


    </div>
  );
};

export default Chatbox;