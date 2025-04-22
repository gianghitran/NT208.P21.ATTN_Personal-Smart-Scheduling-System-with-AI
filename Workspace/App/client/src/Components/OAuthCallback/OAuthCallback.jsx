import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from "../../redux/authSlice";

const OAuthCallback = () => {
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
        // Token đã hết hạn → gọi refresh
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include", // để gửi cookie chứa refresh_token
        });

        if (refreshRes.ok) {
          const { access_token: newToken } = await refreshRes.json();

          // 🔥 Cập nhật token mới vào Redux store
          dispatch(loginSuccess({ ...user, access_token: newToken }));

          res = await connectGoogle(newToken);
          if (res.ok) {
            alert("✅ Kết nối Google Calendar sau khi làm mới token thành công!");
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
        dispatch(loginSuccess({ userData, access_token })); // 🔥 cập nhật Redux
        alert("✅ Kết nối Google Calendar thành công!");
        navigate("/Schedule");
      } else {
        alert("❌ Lỗi không xác định khi kết nối Google Calendar.");
      }
      navigate("/Schedule");
    };

    handleCallback();
  }, [user, navigate]);

  return <p>🔄 Đang xử lý kết nối Google Calendar...</p>;
};

export default OAuthCallback;
