import React, { useState } from 'react'
import styles from "./EmailResendVerification.module.css"
import { useNavigate } from 'react-router-dom'
// import { resendVerificationCode } from "../../redux/apiRequest"
import { customToast } from '../../utils/customToast'

const EmailResendVerification = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      customToast("Please enter a valid email.", "error");
      return;
    }

    setLoading(true);
    const response = await resendVerificationCode(email);
    setLoading(false);

    if (response.success) {
      customToast("Verification code sent.", "success");
      sessionStorage.setItem("pendingEmail", email);
      navigate("/email-verify");
    } else {
      customToast(response.message || "Failed to resend verification code.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Resend Verification Code</h2>
        <p className={styles.subtitle}>Enter your email to resend the code</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend Code"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EmailResendVerification;
