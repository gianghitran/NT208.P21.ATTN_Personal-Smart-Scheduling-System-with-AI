import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import styles from "./VerifyOTP.module.css";

function VerifyOTP() {
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(120); // 2 phút = 120 giây
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation();
    const email = state?.email;

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleResend = async () => {
        setResending(true);
        try {
            await axios.post("/api/auth/forgot-password", { email });
            setTimer(120);
            toast.success("OTP resent to your email!");
        } catch (err) {
            toast.error("Failed to resend OTP!");
        }
        setResending(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/auth/verify-email", { code: otp });
            toast.success("OTP verified! Please reset your password.");
            navigate(`/reset-password/${res.data.user.resetPasswordToken}`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP!");
        }
    };

    return (
        <div className={styles.Wrapper}>
            <form className={styles.otpForm} onSubmit={handleSubmit}>
                <h1>Verify OTP</h1>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: 10 }}>
                    {timer > 0 ? (
                        <span>Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</span>
                    ) : (
                        <button type="button" onClick={handleResend} disabled={resending} className={styles.otpButton}>
                            {resending ? "Resending..." : "Resend OTP"}
                        </button>
                    )}
                </div>
                <button className={styles.otpButton} type="submit">Verify OTP</button>
            </form>
        </div>
    );
}

export default VerifyOTP;