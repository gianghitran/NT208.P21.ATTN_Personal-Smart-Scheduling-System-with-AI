import { useState, useRef } from "react";
import { motion } from "framer-motion"; // npm install framer-motion
import DOMPurify from "dompurify"; // npm install dompurify
import "./chatbox.css";
import ReactMarkdown from "react-markdown"; 

const Chatbox = () => {

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // lịch sử tin nhắn
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) {
      setMessages((prev) => [{ text: "Please enter a message.", type: "error" }, ...prev]);
      return;
    }
    

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;
    const userMessage = `Question: ${input}`;
  
    setLoading(true);
    setMessages((prev) => [{ text: "Loading...", type: "loading" }, ...prev]);

    try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization:
                  "Bearer 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",
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

            const data = await res.json();
            const markdownText =
              data.choices?.[0]?.message?.content || "No response received.";

            setMessages((prev) => [
              { text: DOMPurify.sanitize(markdownText), type: "response" },
              ...prev,
            ]);
    } catch (error) {
      setMessages((prev) => [{ text: "Error: " + error.message, type: "error" }, ...prev]);
    }

    setLoading(false);


    setMessages((prev) => [{ text: userMessage, type: "user" }, ...prev]);

  
  };

  const stopChat = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setLoading(false);
    setMessages((prev) => [{ text: "Chat stopped. You can ask another question.", type: "error" }, ...prev]);
  };
  

  return (
    <div className="container">
          {/* Tiêu đề động */}
          <div className="title">
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
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
          </div >
          <button className="btn btn-success" onClick={sendMessage} disabled={loading}>
            {loading ? "Loading..." : "Ask!"}
          </button>
          <button className="btn btn-danger ml-2" onClick={stopChat} disabled={!loading}>
            Stop
          </button>
          

          {/* Hiển thị phản hồi từ chatbot */}
          <div className="response">
              {messages.map((msg, index) => (
                <div key={index} className={`response_ans ${msg.type}`}>
                
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ))}
            </div>


    </div>
  );
};

export default Chatbox;
