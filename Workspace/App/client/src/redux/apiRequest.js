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
    }
}

export const logoutUser = async (dispatch, navigate) => {
    dispatch(logoutRequest());
    try {
        await axios.post("/api/auth/logout");
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

export const saveEvents = async (selectedEvent, _id) => {
    try {
        if (!selectedEvent.title.trim()) {
            alert("⛔ Lỗi: Vui lòng nhập tiêu đề sự kiện!");
            return { success: false };
        }
        await axios.put(`/api/event/update/${_id}`, selectedEvent);
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

export const deleteEvents = async (_id, userId) => {
    try {
        await axios.delete(`/api/event/delete/${_id}`, {
            data: { userId }
        });
        return;
    } catch (error) {
        return;
    }
};