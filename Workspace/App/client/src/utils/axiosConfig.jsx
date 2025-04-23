import axios from "axios";
import { jwtDecode } from "jwt-decode";

const refreshToken = async () => {
    try {
        const res = await axios.post("/api/auth/refresh", {}, {
            withCredentials: true,
        });
        return res.data;
    } catch (err) {
    }
};

export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create();

    newInstance.interceptors.request.use(
        async (config) => {
            const currentDate = new Date();
            const decodedToken = jwtDecode(user?.access_token);

            if (decodedToken.exp < currentDate.getTime() / 1000) {
                const data = await refreshToken();
                const updatedUser = {
                    ...user,
                    access_token: data.access_token,
                };
                dispatch(stateSuccess(updatedUser));
                config.headers["Authorization"] = "Bearer " + data.access_token;
            } else {
                config.headers["Authorization"] = "Bearer " + user.access_token;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return newInstance;
};
