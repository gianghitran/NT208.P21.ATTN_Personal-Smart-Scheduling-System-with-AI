import { useEffect, useState } from "react";
import styles from "./Setting.module.css";

const Setting = () => {
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

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <h1 className={styles.header}>Setting</h1>
            </div>
            <div className={styles.toggleRow}>
                <span className={styles.toggleLabel}>Chế độ tối (Dark mode)</span>
                <label className={styles.toggleWrapper}>
                    <input
                        type="checkbox"
                        checked={dark}
                        onChange={() => setDark(v => !v)}
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
