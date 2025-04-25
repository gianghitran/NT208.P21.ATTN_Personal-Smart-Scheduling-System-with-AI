import { loginRequest, loginSuccess, loginFailure, registerFailure, registerRequest, registerSuccess, logoutRequest, logoutSuccess, logoutFailure } from "./authSlice";
import axios from "axios";
import {  addMessage,  loadMoreMessages,  updateMessageStatus,  setLoading,} from "./chatSlide";

// Gửi tin nhắn tới AI và lưu vào Redux
export const sendMessageAPI = async (message, dispatch) => {
  const tempId = Date.now();

  dispatch(addMessage({
    id: tempId,
    content: message,
    sender: 'user',
    timestamp: new Date().toISOString(),
    status: 'sending'
  }));

  dispatch(setLoading(true));

  try {
    const res = await axios.post("/api/chat/send", { message });
    const reply = res.data.reply || "Bot chưa trả lời.";

    dispatch(addMessage({
      id: tempId + 1,
      content: reply,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      status: 'sent'
    }));

    dispatch(updateMessageStatus({ id: tempId, status: "sent" }));

    return { success: true, reply };
  } catch (err) {
    dispatch(updateMessageStatus({ id: tempId, status: "failed" }));

    dispatch(addMessage({
      id: tempId + 2,
      content: `❌ Error: ${err.message}`,
      sender: 'system',
      timestamp: new Date().toISOString(),
      status: 'failed'
    }));

    return { success: false, error: err };
  } finally {
    dispatch(setLoading(false));
  }
};

// Lấy lịch sử tin nhắn cũ từ DB và đẩy vào Redux
export const loadOldMessagesAPI = async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get("/api/chat/history");
    const messages = res.data || [];

    messages.forEach(m =>
      dispatch(addMessage({
        id: Date.now() + Math.random(),
        content: m.content,
        sender: m.role,
        timestamp: m.timestamp || new Date().toISOString(),
        status: 'sent'
      }))
    );

    dispatch(loadMoreMessages(messages));
    return { success: true, messages };
  } catch (err) {
    console.error("❌ Lỗi khi load tin nhắn:", err);
    return { success: false, error: err };
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginRequest());
    try {
        const res = await axios.post("/api/auth/login", user);
        dispatch(loginSuccess(res.data));
        navigate("/Schedule");
    } catch (error) {
        dispatch(loginFailure());
        if (error.response) {
            return { success: false, message: error.response.data.message || "Login failed" };
        } else if (error.request) {
            return { success: false, message: "Server did not respond. Please try again later." };
        } else {
            return { success: false, message: "An unexpected error occurred." };
        }
    }
}

export const loginGoogle = async (credentialResponse, dispatch, navigate) => {
    dispatch(loginRequest());
    try {
        const res = await axios.post("/api/auth/google-auth", credentialResponse);
        dispatch(loginSuccess(res.data));
        navigate("/Schedule");
    } catch (error) {
        dispatch(loginFailure());
        if (error.response) {
            return { success: false, message: error.response.data.message || "Login failed" };
        } else if (error.request) {
            return { success: false, message: "Server did not respond. Please try again later." };
        } else {
            return { success: false, message: "An unexpected error occurred." };
        }
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerRequest());
    try {
        await axios.post("/api/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
    } catch (error) {
        dispatch(registerFailure());
        if (error.response) {
            return { success: false, message: error.response.data.message || "Register failed" };
        } else if (error.request) {
            return { success: false, message: "Server did not respond. Please try again later." };
        } else {
            return { success: false, message: "An unexpected error occurred." };
        }
    }
}

export const logoutUser = async (dispatch, navigate, access_token, axiosJWT) => {
    dispatch(logoutRequest());
    try {
        await axios.post("/api/auth/logout", {
            headers: { token: `Bearer ${access_token}` },
        });
        dispatch(logoutSuccess());
        navigate("/");
    } catch (error) {
        dispatch(logoutFailure());
    }
}

export const addEvents = async (newEvent, access_token, axiosJWT) => {
    try {
        await axiosJWT.post("/api/event/create", newEvent, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        if (googleConnected) {
            await axiosJWT.post("/api/sync/add-event", newEvent, {
                headers: { Authorization: `Bearer ${access_token}` },
            });
        }

        return;
    } catch (error) {
        if (!newEvent.title.trim()) {
            alert("⛔ Lỗi: Vui lòng nhập tiêu đề sự kiện!");
        }
        return;
    }
}

export const saveEvents = async (selectedEvent, _id, access_token, axiosJWT) => {
    try {
        if (!selectedEvent.title.trim()) {
            alert("⛔ Lỗi: Vui lòng nhập tiêu đề sự kiện!");
            return { success: false };
        }
        await axiosJWT.put(`/api/event/update/${_id}`, selectedEvent, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        return { success: true }; 
    } catch (error) {
        return { success: false };
    }
}

export const getEvents = async (userId) => {
    try {
        const res = await axios.get(`/api/event/get?userId=${userId}`);
        return res.data;
    } catch (error) {
        return [];
    }
}

export const deleteEvents = async (_id, userId, access_token, axiosJWT) => {
    try {
        if (!access_token) {
            throw new Error("Access token is missing");
        }
        await axiosJWT.delete(`/api/event/delete/${_id}`, {
            headers: { Authorization: `Bearer ${access_token}` },
            data: { userId },
        });
        return;
    } catch (error) {
        return;
    }
};