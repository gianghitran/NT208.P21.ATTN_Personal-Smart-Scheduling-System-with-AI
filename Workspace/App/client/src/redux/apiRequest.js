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