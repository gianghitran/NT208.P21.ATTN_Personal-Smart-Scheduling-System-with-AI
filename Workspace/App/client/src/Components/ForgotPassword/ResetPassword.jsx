import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import styles from "./ResetPassword.module.css";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/forgot-password");
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            toast.error("Passwords do not match!");
            return;
        }
        try {
            await axios.post(`/api/auth/reset-password/${token}`, { password });
            toast.success("Password reset successfully!");
            navigate("/login");
        } catch (err) {
            toast.error("Failed to reset password!");
        }
    };

    return (
        <div className={styles.Wrapper}>
            <form className={styles.resetForm} onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                <div className={styles.inputGroup}>
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required
                    />
                </div>
                <button className={styles.resetButton} type="submit">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPassword;