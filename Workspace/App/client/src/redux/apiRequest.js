import { loginRequest, loginSuccess, loginFailure, registerFailure, registerRequest, registerSuccess, logoutRequest, logoutSuccess, logoutFailure } from "./authSlice";
import { verifyEmailFailure, verifyEmailSuccess, verifyEmailRequest } from "./authSlice";
import axios from "axios";
import { addMessage, loadMoreMessages, setLoading, clearMessages } from "./chatSlide";
import { resetApp } from "./resetAction";
import { customToast } from "../utils/customToast";



// Lấy lịch sử tin nhắn cũ từ DB và đẩy vào Redux
export const loadOldMessagesAPI = async (userId, dispatch) => {
    dispatch(setLoading(true));
    try {

        const res = await axios.get(`/api/chatbox/history/${userId}`);
        const messages = Array.isArray(res.data.history) ? res.data.history : [];

        if (messages.length === 0) {
            console.log("Không có tin nhắn cũ.");
        }

        dispatch(clearMessages()); // Xóa tin nhắn cũ trong Redux trước khi thêm tin nhắn mới

        const sortedMessages = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        sortedMessages.forEach((m) =>
            dispatch(addMessage({
                id: Date.now() + Math.random(),
                content: m.content,
                sender: m.role,
                timestamp: m.timestamp || new Date().toISOString(),
                status: m.role === "user" ? "loading" : "sent"
            }))
        );

        // dispatch(loadMoreMessages(sortedMessages));
        return { success: true, sortedMessages };
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
        sessionStorage.setItem("pendingEmail", user.email);
        navigate("/email-verify");
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

export const verifyEmail = async (code, dispatch, navigate) => {
    dispatch(verifyEmailRequest());
    try {
        const response = await axios.post("/api/auth/verify-email", { code });
        dispatch(verifyEmailSuccess());
        navigate("/login");
    } catch (error) {
        dispatch(verifyEmailFailure());
        if (error.response) {
            return { success: false, message: error.response.data.message || "Verification failed" };
        } else if (error.request) {
            return { success: false, message: "Server did not respond. Please try again later." };
        } else {
            return { success: false, message: "An unexpected error occurred." };
        }
    }
}

export const logoutUser = async (dispatch, navigate) => {
    dispatch(logoutRequest());
    try {
        await axios.post("/api/auth/logout", {}, {
            withCredentials: true,
        });
        dispatch(logoutSuccess());
        dispatch(resetApp());
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
            customToast("Lỗi: Vui lòng nhập tiêu đề sự kiện!", "error", "bottom-right");
        }
        return { success: false };
    }
}

export const saveEvents = async (selectedEvent, _id, access_token, axiosJWT) => {
    try {
        if (!selectedEvent.title.trim()) {
            customToast("Lỗi: Vui lòng nhập tiêu đề sự kiện!", "error", "bottom-right");
            return { success: false };
        }
        const response = await axiosJWT.put(`/api/event/update/${_id}`, selectedEvent, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        return { success: true, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Unknown error";
        return { success: false, message: message };
    }
}

export const getEvents = async (userId, startDate, endDate) => {
    try {
        const res = await axios.get('/api/event/get', {
            params: {
                userId,
                start: startDate?.toISOString(),
                end: endDate?.toISOString()
            }
        });
        return res.data;
    } catch (error) {
        return [];
    }
};


export const deleteEvents = async (_id, userId, access_token, axiosJWT) => {
    try {
        if (!access_token) {
            throw new Error("Access token is missing");
        }
        const response = await axiosJWT.delete(`/api/event/delete/${_id}`, {
            headers: { Authorization: `Bearer ${access_token}` },
            data: { userId },
        });
        console.log("Delete event response:", response);
        return { success: true, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Unknown error";
        return { success: false, message: message };
    }
};

