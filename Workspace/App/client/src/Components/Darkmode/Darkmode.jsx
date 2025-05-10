import { useEffect, useState } from "react";

const Darkmode = () => {
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
    <button
      onClick={() => setDark((prev) => !prev)}
      style={{
        padding: "8px 16px",
        borderRadius: "6px",
        border: "none",
        background: dark ? "#444" : "#eee",
        color: dark ? "#ffcf7d" : "#222",
        cursor: "pointer",
        margin: "8px"
      }}
      aria-label="Toggle dark mode"
    >
      {dark ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default Darkmode;
