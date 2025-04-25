import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import chatbox from './chatbox.module.css';
import { useSelector } from "react-redux";
import { createAxios } from "../../utils/axiosConfig";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import styles from "../Schedule/Schedule.module.css";
import moment from "moment";
import { addMessage, setLoading } from "../../redux/chatSlide";
import { sendMessageAPI, loadOldMessagesAPI } from "../../redux/apiRequest";
import { addEvents, saveEvents, getEvents, deleteEvents } from "../../redux/apiRequest";

const Chatbox = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const userId = user?.userData._id; 
  const [input, setInput] = useState("");
  const access_token = user?.access_token;
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);
  const [isChecked, setTicked] = useState(false);
  
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), category: "work", description: "" });
  const [loadTime, setLoadTime] = useState(new Date());
  
  const [parsedJson, setParsedJson] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
  });
 
  
  useEffect(() => {
    setLoadTime(new Date());
  }, []);


  const renderEvents = async () => {
    try {
      const data = await getEvents(user?.userData._id);
      const items = data.map(({ _id, userId, __v, start, end, ...rest }) => ({
        id: _id,
        title: rest.title,
        start: new Date(start),
        end: new Date(end),
        category: rest.category,
        description: rest.description,
      }));
      setEvents(items);
    } catch (err) {
      console.error("Lỗi khi tải sự kiện:", err);
    }
  };
  useEffect(() => {
    if (userId) {
      renderEvents();
    }
  }, [userId]);
  const addEvent = async () => {
    if (newEvent.end < newEvent.start) {
      alert("Lỗi: Thời gian kết thúc phải sau thời gian bắt đầu!");
      console.log("Lỗi: Thời gian kết thúc phải sau thời gian bắt đầu!");
      return;
    }
    if (!newEvent.title?.trim()) {
      console.log("Tiêu đề sự kiện rỗng ( log từ Chatbox.jsx)")
      return;
    }
    const event = {
      userId: userId,
      title: newEvent.title.trim(),
      start: newEvent.start ? newEvent.start : new Date(),
      end: newEvent.end ? newEvent.end : new Date(),
      category: newEvent.category || "other",
      description: newEvent.description?.trim() || ""
    };
    try {
      console.log("Gửi sự kiện:", event);
      await addEvents(event, access_token, axiosJWT);
      await renderEvents();
      alert("Sự kiện được thêm thành công")
      console.log("Thêm thành công sự kiện");


    } catch (error) {
      console.error("Lỗi khi thêm sự kiện:", error);
      alert("Lỗi khi thêm sự kiện!");
    }
  };
  
  
  const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'); 
  const format_JSON = `Now timestamp is ${now}.Just give me only the JSON of this statement in this format:
        {
          "title": (string),
          "start": (in this regex: "^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$"),
          "end": (in this regex: "^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$"),
          "category": ("work"/"school"/"relax"/"todo"/"others"),
          "description": (string),
          "userId": "${user?.userData._id}"
        }`;
  const CheckboxTick = (e) =>{
    const isChecked = e.target.checked;
    setTicked(isChecked); //update state
  };
  const NormalFormat=`do not give JSON, give nomarl respone. Now timestamp is ${now}`






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
    if (userId) {
      
      loadOldMessagesAPI(userId,dispatch);
      renderEvents();
    }
  }, [userId, dispatch]);
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
      const historyRes = await fetch(`/api/chatbox/send/${userId}`, {
        method: "GET", // Cập nhật lại phương thức lấy lịch sử
      });
      const historyData = await historyRes.json();
      const filteredMessages = Array.isArray(historyData.history)
        ? historyData.history.slice(-30).map((msg) => ({
            role: msg.role,
            content: msg.content,
        }))
        : [];

        const messagesToSend = isChecked 
        ? [...filteredMessages, { role: "user", content: input }, { role: "user", content: format_JSON }]
        : [...filteredMessages, { role: "user", content: input }, { role: "user", content: NormalFormat }];

      
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
      
      if (isChecked && botReply.includes('"title"') && botReply.includes('"start"')) {
        try {
          const jsonStart = botReply.indexOf("{");
          const jsonEnd = botReply.lastIndexOf("}") + 1;
          const jsonStr = botReply.substring(jsonStart, jsonEnd);
          const parsed = JSON.parse(jsonStr);

          if (parsed.title && parsed.start && parsed.end) {
        setParsedJson(parsed); // Cập nhật state trung gian nếu cần
        setNewEvent({
          title: parsed.title,
          description: parsed.description || "",
          start: new Date(parsed.start),
          end: new Date(parsed.end),
          category: parsed.category || "work",
        });
          }
        } catch (err) {
          console.error("⚠️ Không thể phân tích JSON từ phản hồi:", err);
        }
      }

      
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
        setMessages((prev) => [{ text: "Rate limit hit. Try again later.", type: "error" }, ...prev]);}
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
              <input className={chatbox.tickbox} type="checkbox" onChange={CheckboxTick} checked={isChecked} disabled={loading}/>
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
          {!isChecked&&messages.filter(msg => msg.text && msg.text.trim()).length > 0 &&<div className={chatbox.response}>
              {messages.filter(msg => msg.text && msg.text.trim()).map((msg, index) => (
                //  <div key={index} className={`${chatbox.response_ans} ${msg.type}`}>
                <div key={index} className={`${chatbox.response_ans} ${chatbox[msg.type] || ""}`}>
                  
                 <ReactMarkdown
                   components={{
                    pre: ({ children }) => <pre className={`${chatbox.code_block}`}>{children}</pre>,
                    code: ({ children }) => <code className={`${chatbox.inline_code}`}>{children}</code>

                   }}
                 >
                   {msg.text}
                 </ReactMarkdown>
               </div>
              ))}
            </div>}
            

            {isChecked &&
              messages.filter(msg =>
                msg.type === "response" &&
                msg.text?.trim() &&
                new Date(msg.time || Date.now()) > loadTime
              ).length > 0 && (
                <div className={chatbox.response}>
                  {messages
                    .filter(msg =>
                      msg.text && 
                      msg.type == "response" &&
                      msg.text?.trim() &&
                      new Date(msg.time || Date.now()) > loadTime
                    )
                    .map((msg, index) => {
                      
                        return (
                          
                        <div key={index} className={`${chatbox.response_ans} ${chatbox[msg.type] || ""}`}>
                          {parsedJson ? (
                          <div className={chatbox.event_card}>
                          <div className={chatbox.formGroup}>
                          <label>
                            <strong>Title:</strong>
                            <input
                              type="text"
                              name="title"
                              value={newEvent.title}
                              className={chatbox.input_field}
                              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            />
                          </label>
                          </div>
                          <div className={chatbox.formGroup}>
                          <label>
                            <strong>Start Date:</strong>
                            <input
                              type="datetime-local"
                              value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                              className={chatbox.input_field}
                              onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                            />
                          </label>
                          </div>
                          <div className={chatbox.formGroup}>
                          <label>
                            <strong>End Date:</strong>
                            <input
                              type="datetime-local"
                              value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                              className={chatbox.input_field}
                              onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                            />
                          </label>
                          </div>
                          <div className={chatbox.formGroup}>
                          <label>
                            <strong>Category:</strong>
                            <select
                              value={newEvent.category}
                              className={chatbox.input_field}
                              onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                            >
                              <option value="work">Work</option>
                              <option value="school">School</option>
                              <option value="relax">Relax</option>
                              <option value="todo">Todo</option>
                              <option value="others">Others</option>
                            </select>
                          </label>
                          </div>
                          <div className={chatbox.formGroup}>
                          <label>
                            <strong>Description:</strong>
                            <textarea
                              type="text"
                              name="description"
                              value={newEvent.description}
                              className={chatbox.input_field}
                              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            />
                          </label>
                          </div>
                          <button
                            className={chatbox.btnSuccess}
                            onClick={addEvent}
                          
                          >
                            Add event (+)
                          </button>
                          </div>
                          ) : (
                          <>
                          <ReactMarkdown
                          components={{
                          pre: ({ children }) => (
                            <pre className={chatbox.code_block}>{children}</pre>
                          ),
                          code: ({ children }) => (
                            <code className={chatbox.inline_code}>{children}</code>
                          ),
                          }}
                          >
                          {msg.text}
                          </ReactMarkdown>
                          </>
                          )}
                        </div>
                        );
                    })}
                  
                  
                </div>
                
                
            )}



    </div>
  );
};

export default Chatbox;