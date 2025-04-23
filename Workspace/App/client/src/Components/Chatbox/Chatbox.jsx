import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import chatbox from './chatbox.module.css';
import { useSelector } from "react-redux";

const Chatbox = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);

  const userId = user?.userData._id; 
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);
  const [CheckBox, setTicked] = useState(false);
  const format_JSON = `Just give me only the JSON of this statement in this format:
        {
          "title": (string),
          "start": (in this regex: "^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$"),
          "end": (in this regex: "^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$"),
          "category": ("work"/"school"/"relax"/"todo"/"others"),
          "description": (string),
          "userId": "${user?.userData._id}"
        }`;
  const CheckboxTick = (e) =>{
    const CheckBox = e.target.checked;
    setTicked(CheckBox); //update state
  };
  const NormalFormat=`do not give JSON, give nomarl respone`

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

  // Hàm gửi tin nhắn đến AI và lưu vào MongoDB
  const sendMessage = async () => {
    if (!input.trim()) {
      setMessages((prev) => [{ text: "Messages not found!.", type: "error" }, ...prev]);
      return;
    }
  
    if (!userId) {
      setMessages((prev) => [{ text: "Sign in to chat!", type: "error" }, ...prev]);
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
      const historyRes = await fetch(`http://localhost:4000/api/chatbox/send/${userId}`);
      const historyData = await historyRes.json();      
      const filteredMessages = Array.isArray(historyData.history)
        ? historyData.history
            .slice(-30)
            .map((msg) => ({
              role: msg.role,
              content: msg.content,
            }))
        : [];

      let messagesToSend
      if(CheckBox){
        messagesToSend = [...filteredMessages, { role: "user", content: input },{ role: "user", content:format_JSON }];
        console.log("Respone with JSON")
      }
      else{
        messagesToSend = [...filteredMessages, { role: "user", content: input },{ role: "user", content:NormalFormat}];
        console.log("Respone without JSON")
        
      }

      
      const res = await fetch(`http://localhost:4000/api/chatbox/ask/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messagesToSend }),
        signal,
      });
      
  
      if (!res.ok) {
        throw new Error(`API Error: ${res.status} - ${res.statusText}`);
      }
  
      const data = await res.json();
      const botReply = data.choices?.[0]?.message?.content || "Not response";
  
      // Cập nhật tin nhắn ngay lập tức trước khi gửi lên server
      setMessages((prev) => [
        { text: userMessage, type: "user" },
        { text: DOMPurify.sanitize(botReply), type: "response" },
        ...prev,
      ]);
  
      // Gửi lên MongoDB
      await fetch(`http://localhost:4000/api/chatbox/history/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: input, botReply }),
      });
    fetchChatHistory();
  
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log("Rate limit hit: token usage");
        throw new Error("Token limit exceeded. Try again later.");}
      else{
      setMessages((prev) => [{ text: `Error: ${error.message}`, type: "error" }, ...prev]);}
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
          {/* /* select button event render: */}
          <div style={{marginTop: "10px"}}>
          <button className={chatbox.btnWarning}>
            <label  style={{ margin: "10px", display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "10px", fontWeight: "bold" }}>Events Schedule Mode</span>
              <input className={chatbox.tickbox} type="checkbox" onChange={CheckboxTick} checked={CheckBox}/>
            </label>
          </button>
          </div>

          <button className={chatbox.btnSuccess} onClick={sendMessage} disabled={loading}>
            {loading ? "Loading..." : "Ask!"}
          </button>
          <button className={chatbox.btnDanger} onClick={stopChat} disabled={!loading}>
            Stop
          </button>

          

      
              

          {/* Hiển thị phản hồi từ chatbot */}
          {messages.filter(msg => msg.text && msg.text.trim()).length > 0 &&<div className={chatbox.response}>
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
            </div>}


    </div>
  );
};

export default Chatbox;