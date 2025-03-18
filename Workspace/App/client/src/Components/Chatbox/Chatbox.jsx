import { Link } from "react-router-dom";
import "./chatbox.css";
import { motion } from "framer-motion"; //npm install framer-motion

const Chatbox = () => {
    return (  
        <div className="title">
            <motion.h1
                className="text-6xl font-bold"
                animate={{ backgroundPosition: "200% 0" ,opacity: [0.5, 1, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                    fontSize: "2rem",
                    fontWeight: "900",
                    background: "linear-gradient(90deg, #ff4b2b,rgb(253, 126, 8) ,rgb(252, 213, 41))",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
                >
                🔥 [SMART] To do list - Chatbox 🔥
                </motion.h1>
        </div>
    );
}
 
export default Chatbox;