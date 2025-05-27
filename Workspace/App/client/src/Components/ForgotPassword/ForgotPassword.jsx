import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/auth/forgot-password", { email });
            toast.success("OTP sent to your email!");
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            toast.error(err.response?.data?.message || "Email not found!");
        }
        setLoading(false);
    };

    return (
        <div className={styles.Wrapper}>
            <form className={styles.forgotForm} onSubmit={handleSubmit}>
                <h1>Forgot Password</h1>
                <div className={styles.inputGroup}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <button
                    className={styles.forgotButton}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;