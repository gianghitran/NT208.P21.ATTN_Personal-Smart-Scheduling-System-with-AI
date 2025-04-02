import { loginRequest, loginSuccess, loginFailure, registerFailure, registerRequest, registerSuccess, logoutRequest, logoutSuccess, logoutFailure } from "./authSlice";
import axios from "axios";

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

export const addEvents = async (newEvent) => {
    try {
        await axios.post("/api/event/create", newEvent);
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
            headers: { token: `Bearer ${access_token}` }
        });
        return;
    } catch (error) {
        return;
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
        await axiosJWT.delete(`/api/event/delete/${_id}`, {
            headers: { token: `Bearer ${access_token}` },
            data: { userId },
        });
        return;
    } catch (error) {
        return;
    }
};