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
import { addMessage } from "../../redux/chatSlide";
import { loadOldMessagesAPI } from "../../redux/apiRequest";
import { addEvents, saveEvents, getEvents, deleteEvents } from "../../redux/apiRequest";
import RecordButton from "../VoiceAsk/Record_Button";
import { ToastContainer, toast } from "react-toastify";
import { customToast } from "../../utils/customToast";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";


const Chatbox = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const userId = user?.userData._id; 
  const [input, setInput] = useState("");
  const access_token = user?.access_token;
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  
  const messages = useSelector((state) => state.chat.messages);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);
  const [isChecked, setTicked] = useState(false);
  
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState(false);
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

  
  const addEvent = async (event) => {
    if (!event || !event.title || !event.start || !event.end) {
      // toast.error("Tiêu đề sự kiện rỗng!");
      customToast("Tiêu đề sự kiện rỗng!", "error", "bottom-right", 3000);

      return;
    }
    if (new Date(event.start).getTime() >= new Date(event.end).getTime()) {
      // toast.error("Thời gian bắt đầu phải trước thời gian kết thúc!");
      customToast("Thời gian bắt đầu phải trước thời gian kết thúc!", "error", "bottom-right", 3000);
      return;
    }
    
    try {
      console.log("Gửi sự kiện:", event);
      await addEvents(event, access_token, axiosJWT);
      
      // toast.success("Sự kiện được thêm thành công");
      customToast("Sự kiện được thêm thành công", "success", "bottom-right", 3000);
      console.log("Thêm thành công sự kiện");
      
    } catch (error) {
      console.error("Lỗi khi thêm sự kiện:", error);
      // toast.error("Lỗi khi thêm sự kiện!");
      customToast("Lỗi khi thêm sự kiện!", "error", "bottom-right", 3000);
    }
  };
  
  
  
  const CheckboxTick = (e) =>{
    const isChecked = e.target.checked;
    setTicked(isChecked); //update state
  };
  const checkIfJSON = (str) => {
    try { 
      if (str.includes('"title"') && str.includes('"start"')) {
        const jsonStart = str.indexOf("{");
        const jsonEnd = str.lastIndexOf("}") + 1;
        const jsonStr = str.substring(jsonStart, jsonEnd);
        const parsed = JSON.parse(jsonStr);
        return parsed && typeof parsed === "object";
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };




    // Gọi lịch sử chat khi component mount
  
    useEffect(() => {
    if (userId) {
      
      loadOldMessagesAPI(userId,dispatch);
    }
  }, [userId, dispatch]);

  // Hàm lấy số giờ offset múi giờ của máy
  const timezoneOffsetHours = -new Date().getTimezoneOffset() / 60;
  // Hàm gửi tin nhắn đến AI và lưu vào MongoDB
  const sendMessage = async () => {
    if (!input.trim()) {
      dispatch(addMessage({
        content: "Messages not found!.",
        sender: "system",
        timestamp: new Date().toISOString(),
        status: "error"
      }));
      return;
    }
  
    if (!userId) {
      dispatch(addMessage({
        content: "Sign in to chat!",
        sender: "system",
        timestamp: new Date().toISOString(),
        status: "error"
      }));
      return;
    }
  
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  
    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;
    const userMessage = `[Question:]\n ${input}`;
  
    // Hiển thị tin nhắn của người dùng ngay lập tức
    // const user_ask= `[Asking:]\n ${input}`;
    // dispatch(addMessage({
    //   content: user_ask,
    //   sender: "user",
    //   timestamp: new Date().toISOString(),
    //   status: "loading"
    // }));
    
    setInput("");
    setLoading(true);
  
    try {
      const historyRes = await fetch(`/api/chatbox/send/${userId}`, {
        method: "GET", 
      });
      const historyData = await historyRes.json();
      const filteredMessages = Array.isArray(historyData.history)
        ? historyData.history.slice(-30).map((msg) => ({
            role: msg.role,
            content: msg.content,
        }))
        : [];
        const now = moment().toDate(); 
        // Ngày bắt đầu = ngày hiện tại - 30 ngày
        const startDateFETCH = moment().subtract(30, "days").toDate();
        // Ngày kết thúc = ngày hiện tại + 90 ngày
        const endDateFETCH = moment().add(90, "days").toDate();
        
        
        const eventsArr = await getEvents(user?.userData._id, startDateFETCH, endDateFETCH);
         // Lấy số giờ offset múi giờ của máy (ví dụ GMT+7 thì là 7)
        
        const eventsArrGMT7 = eventsArr.map(event => ({
            ...event,
            start: new Date(new Date(event.start).getTime() + timezoneOffsetHours * 60 * 60 * 1000).toISOString(),
            end: new Date(new Date(event.end).getTime() + timezoneOffsetHours * 60 * 60 * 1000).toISOString(),
          }));
        
        const currentEvents = JSON.stringify(eventsArrGMT7);

        const format_JSON = `Now timestamp is ${now}. In my calendar, there were my events in timetable: ${currentEvents} , so when you schedule an event, avoid those times.
        Just give me only the JSON of this statement in this format:
              {
                "title": (string),
                "start": (in this regex: "^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$"),
                "end": (in this regex: "^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$"),
                "category": ("work"/"school"/"relax"/"todo"/"others"),
                "description": (string),
                "userId": "${user?.userData._id}"
              }`;
        const NormalFormat=`Now timestamp is ${now}. This is my timetable: ${currentEvents}. (Do not give JSON, give nomarl respone.)`;
        const systemMessage = {
          role: "system",
          content: "Previous messages are the chat history between the user and Chatbox. The event timelines in the chat history are not accurate. Please follow the timestamp in timetable.",
        };
        const messagesToSend = isChecked 
        ? [systemMessage,...filteredMessages, { role: "user", content: input }, { role: "user", content: format_JSON }]
        : [systemMessage,...filteredMessages, { role: "user", content: input }, { role: "user", content: NormalFormat }];
      
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
        

        // Gửi tin nhắn từ AI (assistant)
        const chatbox_Res=`[Chatbox Reply:]\n ${DOMPurify.sanitize(botReply)}`
        dispatch(addMessage({
          content: chatbox_Res,
          sender: "assistant",
          timestamp: new Date().toISOString(),
          status: "sent"
        }));
      // Câu hỏi người dùng

        dispatch(addMessage({
          content: userMessage,
          sender: "user",
          timestamp: new Date().toISOString(),
          status: "sent"
        }));
        
        
  
      // Gửi lên MongoDB
      await fetch(`http://localhost:4000/api/chatbox/history/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: input, botReply }),
      });
    
    setLoading(false);
  
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log("Rate limit hit: token usage");
        //Lỗi
        alert("Rate limit hit: token usage");
      }
      else{
      //Lỗi
      alert("Error: " + error.message);
      console.error("Error:", error.message);
    }

    
  
    setLoading(false);
  };
};

  // Hàm dừng chat
  const stopChat = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setLoading(false);
    dispatch(addMessage({
      content: "Chat stopped. You can ask another question.",
      sender: "system",
      timestamp: new Date().toISOString(),
      status: "error"
    }));

    };

    const [editableEvents, setEditableEvents] = useState({});

    useEffect(() => {
      const slicedSortedMessages = [...messages]
        .slice(-24)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
      const newEditableEvents = {};
  
      slicedSortedMessages.forEach((msg, index) => {
        if (
          msg.sender === "assistant" &&
          typeof msg.content === "string" &&
          checkIfJSON(msg.content)
        ) {
          const parsed = parseEventFromJSON(msg.content);
          if (parsed) {
            parsed.start = new Date(new Date(parsed.start).getTime() - timezoneOffsetHours * 60 * 60 * 1000).toISOString();
            parsed.end = new Date(new Date(parsed.end).getTime() - timezoneOffsetHours * 60 * 60 * 1000).toISOString();
            newEditableEvents[index] = parsed;
          }
        }
      });
  
      const isChanged = Object.entries(newEditableEvents).some(
        ([key, value]) =>
          JSON.stringify(editableEvents[key]) !== JSON.stringify(value)
      );
  
      if (isChanged) {
        setEditableEvents((prev) => ({
          ...prev,
          ...newEditableEvents,
        }));
      }
    }, [messages]);

    const handleFieldChange = (field, value,index) => {
      setEditableEvents((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: value,
        },
      }));
    };


    const parseEventFromJSON = (str) => {
      try {
        const jsonStart = str.indexOf("{");
        const jsonEnd = str.lastIndexOf("}") + 1;
        const jsonStr = str.substring(jsonStart, jsonEnd);
        const parsed = JSON.parse(jsonStr);
        
        if (parsed.title && parsed.start && parsed.end) {
          return parsed;
        }
        return null;
      } catch (err) {
        return null;
      }
    };
    
    const [voiceText, setVoiceText] = useState("");
    const [isTransferring, setIsTransferring] = useState(false);
    const handleTranscribedText = (text) => {
      console.log("Nhận từ RecordButton:", text);
      setVoiceText(text);
      setInput(text);  
    };
    
    // useEffect(() => {
    //   const latestIndex = [...messages].reverse().findIndex(
    //     (msg) => msg.sender === "assistant" && checkIfJSON(msg.content)
    //   );
    
    //   if (latestIndex !== -1) {
    //     const realIndex = messages.length - 1 - latestIndex;
    //     const parsed = parseEventFromJSON(messages[realIndex].content);
    //     if (parsed && !editableEvents[realIndex]) {
    //       setEditableEvents((prev) => ({
    //         ...prev,
    //         [realIndex]: parsed,
    //       }));
    //     }
    //   }
    // }, [messages]);
    
    
  return (

    <div className={chatbox.container}>
                        <Helmet>
                          <html lang="vi" />
                          <title>Bearlander Chatbox - Trợ lý AI lập lịch | AI Scheduling Assistant</title>
                          {/*Mô tả bằng tiếng Việt */}
                          <meta
                            name="description"
                            content="Trò chuyện với AI để tạo sự kiện, tránh trùng lịch và nhắc việc tự động bằng Chatbox thông minh."
                          />
                          {/*Mô tả bằng tiếng Anh */}
                          <meta
                            name="description"
                            lang="en"
                            content="Chat with AI to automatically create events, avoid schedule conflicts, and receive reminders with the intelligent Bearlander Chatbox."
                          />
                          {/*Keywords*/}
                          <meta
                            name="keywords"
                            content="chatbox AI, lập lịch thông minh, nhắc việc, AI calendar assistant, smart scheduling, Bearlander, trợ lý lập lịch"
                          />
                          {/*Thẻ canonical*/}
                          <link rel="canonical" href="https://bearlander.onrender.com/Chatbox" />
                        </Helmet>


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
            [SMART] [Chatbox]<a></a> AI Scheduling Assistant
          </motion.h1>
            </div>

          
            {/* Input và Button */}
            <div className={chatbox.wrapper}>
              <div className={chatbox.form_group}>
                <input
                  type="text"
                  className={chatbox.form_control}
                  placeholder="Enter your question"
                  value={isTransferring ? "Transferring..." : input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={isTransferring}
                />
              </div >

              <div className={chatbox.record_button}>
                <RecordButton onTransfer={handleTranscribedText} onTransfering={(val) => setIsTransferring(val)}/>
              </div>
          </div>

          
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
          {messages.length > 0 && (
            <div className={chatbox.response}>
            {[...messages]
            .slice(-24)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .map((msg, index) => {
              let messageClass = chatbox.response_ans;
              if (msg.sender === "user") {
                messageClass += ` ${chatbox.user}`;
              } else if (msg.sender === "assistant") {
                messageClass += ``;
              } else if (msg.sender === "system") {
                messageClass += ` ${chatbox.error}`;
              }
        
              if (msg.status === "loading") {
                messageClass += ` ${chatbox.loading}`;
              }
              let parsedEvent = null;
              if (typeof msg.content === "string" && checkIfJSON(msg.content)) {
                parsedEvent = parseEventFromJSON(msg.content);
              }
              if (parsedEvent && msg.sender === "assistant") {
                if (!editableEvents[index]) {
                  setEditableEvents((prev) => ({
                    ...prev,
                    [index]: parsedEvent,
                  }));
                }

                //* Đã chuyển hàm handleFieldChange thành một hàm bên ngoài *//

                
                return (
                  <div key={index} className={messageClass}>
                         
                          <div className={chatbox.event_card}>
                          <div className={chatbox.formGroup}>
                          <label>
                            <strong>Title:</strong>
                            <input
                              type="text"
                              name="title"
                              value={editableEvents[index]?.title || ""}
                              className={chatbox.input_field}
                              onChange={(e) => handleFieldChange("title", e.target.value,index)}
                              // onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            />
                          </label>
                          </div>
                          <div className={chatbox.formGroup}>
                          <label>
                            <strong>Start Date:</strong>
                            <input
                              type="datetime-local"
                              value={moment(editableEvents[index]?.start).format("YYYY-MM-DDTHH:mm")}
                              className={chatbox.input_field}
                              onChange={(e) => handleFieldChange("start", e.target.value,index)}
                              // onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                            />
                          </label>
                          </div>
                          <div className={chatbox.formGroup}>
                          <label>
                            <strong>End Date:</strong>
                            <input
                              type="datetime-local"
                              value={moment(editableEvents[index]?.end).format("YYYY-MM-DDTHH:mm")}
                              className={chatbox.input_field}
                              onChange={(e) => handleFieldChange("end", e.target.value,index)}
                              // onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                            />
                          </label>
                          </div>
                          <div className={chatbox.formGroup}>
                          <label>
                            <strong>Category:</strong>
                            <select
                              value={editableEvents[index]?.category}
                              className={chatbox.input_field}
                              onChange={(e) => handleFieldChange("category", e.target.value,index)}
                              // onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
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
                              value={editableEvents[index]?.description}
                              className={chatbox.input_field}
                              onChange={(e) => handleFieldChange("description", e.target.value,index)}
                              // onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            />
                          </label>
                          </div>
                          <button
                            className={chatbox.btnSuccess}
                            onClick={() => {
                              const newevent = {
                                title: editableEvents[index]?.title,
                                start: new Date(editableEvents[index]?.start),
                                end: new Date(editableEvents[index]?.end),
                                category: editableEvents[index]?.category,
                                description: editableEvents[index]?.description,
                              };
                              setNewEvent(newevent);
                              addEvent(newevent);
                            }}
                            
                          >
                            Add event to Calendar (+)
                          </button>

                              </div >
                            </div>
                );
              }
            else{
              return (
                <div key={index} className={messageClass}>
                    <ReactMarkdown
                      components={{
                        pre: ({ children }) => <pre className={`${chatbox.code_block}`}>{children}</pre>,
                        code: ({ children }) => <code className={`${chatbox.inline_code}`}>{children}</code>
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                          
                    
                          );
                        }
                      })}
                  </div>
                )}
                {/* <ToastContainer position="bottom-right" autoClose={3000} /> */}
              </div>
);
};

export default Chatbox;
