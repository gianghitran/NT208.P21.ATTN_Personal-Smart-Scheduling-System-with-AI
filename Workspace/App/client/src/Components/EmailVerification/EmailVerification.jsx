import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./EmailVerification.module.css"

const EmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRef = useRef([])
  const navigate = useNavigate()

  const handleChange = (value, index) => {
    if (!/^[0-9]$/.test(value) && value !== "") return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value !== "" && index < 5) {
      inputRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRef.current[index - 1].focus()
    }
  }

  // Tự động xác minh khi đủ 6 số
  useEffect(() => {
    if (code.every(d => d !== "")) {
      const fullCode = code.join("")
      console.log("Xác minh mã:", fullCode)
      // Gọi API xác minh hoặc chuyển trang
      navigate("/login")
    }
  }, [code, navigate])

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Email Verification</h2>
        <p className={styles.subtitle}>Enter the 6-digit code sent to your email</p>
        <div className={styles.codeInputs}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRef.current[index] = el}
              type="text"
              maxLength="1"
              value={digit}
              onChange={e => handleChange(e.target.value, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              className={styles.input}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmailVerification
