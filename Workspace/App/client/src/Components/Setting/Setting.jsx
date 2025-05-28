import { useEffect, useState } from "react";
import styles from "./Setting.module.css";
import { useSelector } from "react-redux";

const Setting = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    
    // Dùng thông tin từ Redux store, fallback sang localStorage
    const userData = user?.userData;

    const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

    useEffect(() => {
        if (dark) {
            document.body.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    const role = userData.email === "admin@gmail.com" ? "Administrator" : "User";

    return (
        <div className={styles.container}>
            {/* User Info Section */}
            <div className={styles.userInfoSection}>
                <img
                    src="https://img.icons8.com/ios-filled/100/000000/user-male-circle.png"
                    alt="User"
                    className={styles.userAvatar}
                />
                <div className={styles.userInfoText}>
                    <div className={styles.userName}>{userData.full_name}</div>
                    <div className={styles.userRole}>{role}</div>
                    <div className={styles.userEmail}>{userData.email}</div>
                </div>
            </div>

            <hr className={styles.divider} />

            {/* Setting Section */}
            <div className={styles.headerSection}>
                <h1 className={styles.header}>Setting</h1>
            </div>
            <div className={styles.toggleRow}>
                <span className={styles.toggleLabel}>Chế độ tối (Dark mode)</span>
                <label className={styles.toggleWrapper}>
                    <input
                        type="checkbox"
                        checked={dark}
                        onChange={() => setDark((v) => !v)}
                        className={styles.toggleInput}
                        aria-label="Bật/tắt dark mode"
                    />
                    <span className={styles.toggleBackground}></span>
                    <span
                        className={styles.toggleCircle}
                        style={{ left: dark ? 26 : 4 }}
                    ></span>
                </label>
            </div>
        </div>
    );
};

export default Setting;
