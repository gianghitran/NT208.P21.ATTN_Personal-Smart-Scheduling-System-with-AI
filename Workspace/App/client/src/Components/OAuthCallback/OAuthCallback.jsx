import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, loginRequest, loginFailure } from "../../redux/authSlice";
import axios from 'axios';

export const OAuthCallback = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code || !user?.access_token) return;

      const connectGoogle = async (token) => {
        return fetch("/api/auth/connect-google/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        });
      };

      let res = await connectGoogle(user.access_token);

      if (res.status === 403) {
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          const { access_token: newToken } = await refreshRes.json();
          res = await connectGoogle(newToken);
          if (res.ok) {
            const { userData, access_token } = await res.json();
            dispatch(loginSuccess({ userData, access_token })); 
            alert("✅ Kết nối Google Calendar sau khi làm mới token thành công!");
            navigate("/Schedule");
            return;
          } else {
            alert("❌ Token mới nhưng vẫn không kết nối được Google Calendar.");
          }
        } else {
          alert("❌ Token đã hết hạn và không thể làm mới. Vui lòng đăng nhập lại.");
          navigate("/login");
          return;
        }
      } else if (res.ok) {
        const { userData, access_token } = await res.json();
        dispatch(loginSuccess({ userData, access_token }));
        alert("✅ Kết nối Google Calendar thành công!");
        navigate("/Schedule");
        return;
      } else {
        alert("❌ Lỗi không xác định khi kết nối Google Calendar.");
      }
      navigate("/Schedule");
    };

    handleCallback();
  }, [user, navigate]);

  return <p>🔄 Đang xử lý kết nối Google Calendar...</p>;
};

export const OAuthCallbackLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = searchParams.get("error");

  useEffect(() => {
    const token = searchParams.get("access_token");

    if (error) {
      const errorMessage = searchParams.get("error") || "Login failed";
      navigate("/login", { state: { error: errorMessage } });
      return;
    }

    const fetchUserInfo = async () => {
      if (!token) return navigate("/login");

      dispatch(loginRequest());
      try {
        const res = await axios.get("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = {
          userData: res.data,
          access_token: token,
        }

        dispatch(loginSuccess(payload));
        navigate("/Schedule");
      } catch (error) {
        dispatch(loginFailure());
        const errorMessage = error?.response?.data?.message || "Login failed";

        navigate("/login", { state: { error: errorMessage } });
      }
    };

    fetchUserInfo();
  }, [dispatch, navigate, searchParams]);

  return <div>Login Google is loading...</div>;
};
