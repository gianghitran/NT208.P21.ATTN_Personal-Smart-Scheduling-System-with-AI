import { useState, useRef } from "react";
import { motion } from "framer-motion"; // npm install framer-motion
import DOMPurify from "dompurify"; // npm install dompurify
import "./chatbox.css";

const Chatbox = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null); // Lưu trữ AbortController

  const sendMessage = async () => {
    if (!input.trim()) {
      setResponse("Please enter a message.");
      return;
    }

    if (controllerRef.current) {
        controllerRef.current.abort();
      }
  
    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;
    
    setLoading(true);
    setResponse("Loading...");

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
      });

      const data = await res.json();
      const markdownText =
        data.choices?.[0]?.message?.content || "No response received.";

      setResponse(DOMPurify.sanitize(markdownText));
    } catch (error) {
      setResponse("Error: " + error.message);
    }

    setLoading(false);
  };
    const stopChat = () => {
        if (controllerRef.current) {
          controllerRef.current.abort();
          controllerRef.current = null;
        }
        setLoading(false);
        setResponse("Chat stopped. You can ask another question.");
      };
    
  

  return (
    <div className="container">
      {/* Tiêu đề động */}
      <div className="title">
        <motion.h1
          className="text-6xl font-bold"
          animate={{ backgroundPosition: "200% 0", opacity: [0.5, 1, 1] }}
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
          🔥 [SMART] To do list - Chatbox 🔥
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
      </div>
      <button className="btn btn-success" onClick={sendMessage} disabled={loading}>
        {loading ? "Loading..." : "Ask!"}
      </button>
      <button className="btn btn-danger ml-2" onClick={stopChat} disabled={!loading}>
        Stop
      </button>

      {/* Hiển thị phản hồi từ chatbot */}
      <div className="response">
        <div dangerouslySetInnerHTML={{ __html: response }} />
      </div>
    </div>
  );
};

    export default Chatbox;
