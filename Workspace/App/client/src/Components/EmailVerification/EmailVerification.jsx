import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { verifyEmail } from "../../redux/apiRequest"
import { customToast } from "../../utils/customToast"
import styles from "./EmailVerification.module.css"
import { toast } from "react-toastify"

const EmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check if there is a pending email in session storage
  useEffect(() => {
    const email = sessionStorage.getItem("pendingEmail");
    if (!email) {
      customToast("No pending email found. Please register again.", "error");
      setTimeout(() => {
        navigate("/register");
      }, 100);
    }
  }, [navigate]);

  const handleChange = (value, index) => {
    if (!/^[0-9]$/.test(value) && value !== "") return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value !== "" && index < 5) {
      inputRef.current[index + 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").split("").slice(0, 6)
    const newCode = [...code]

    for (let i = 0; i < pastedData.length; i++) {
      if (/^[0-9]$/.test(pastedData[i])) {
        newCode[i] = pastedData[i]
      }
    }

    setCode(newCode)

    if (pastedData.length > 0) {
      inputRef.current[Math.min(pastedData.length, 5)].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRef.current[index - 1].focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    const loadingId = customToast(`Verifying email...`, "loading");

    const response = await verifyEmail(fullCode, dispatch, navigate);
    if (response.success) {
      toast.dismiss(loadingId);
      sessionStorage.removeItem("pendingEmail");
      customToast("success", "Email verified successfully");
    } else {
      toast.dismiss(loadingId);
      customToast("error", response.message || "Verification failed")
    }
  }

  const handleResend = async (e) => {
    e.preventDefault();
    
  }

  useEffect(() => {
    if (code.every(d => d !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code, navigate])

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Email Verification</h2>
        <p className={styles.subtitle}>Enter the 6-digit code sent to your email</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.codeInputs}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRef.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={e => handleChange(e.target.value, index)}
                onPaste={handlePaste}
                onKeyDown={e => handleKeyDown(e, index)}
                className={styles.input}
              />
            ))}
          </div>
        </form>
        {/* <button
          className={styles.resendBtn}
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? "Sending..." : "Resend verification code"}
        </button> */}
      </div>
    </div>
  )
}

export default EmailVerification
