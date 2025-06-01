import loginStyle from "./Login.module.css";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/apiRequest";
import { GoogleLogin } from "@react-oauth/google";
import { IoIosMail } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

const Login = () => {
    const baseUrl = window.location.origin;
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const errorFromState = location.state?.error;
        if (errorFromState) {
            setError(errorFromState);
            window.history.replaceState({}, document.title); 
        }
    }, [location.state]);

    useEffect(() => {
        if (rememberMe) {
            document.cookie = `rememberMe=true; path=/; max-age=604800`; // 7 days
        } else {
            document.cookie = `rememberMe=; path=/; max-age=0`; // xóa cookie
        }
    }, [rememberMe]);

    const handleGooogleOnClick = () => {
        if (rememberMe) {
            document.cookie = `rememberMe=${rememberMe}; path=/; max-age=300`; 
            console.log("Cookie set:", document.cookie);

        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        const user = {
            email: email,
            password: password,
            rememberMe: rememberMe
        };

        try {
            const response = await loginUser(user, dispatch, navigate);

            if (response && !response.success) {
                setError(response.message);
            }
        } catch (error) {
            setError("An unexpected error occurred.");
        }
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const EyeIcon = showPassword ? FaEyeSlash : FaEye;


    return (
        <div className={loginStyle.Wrapper}>
            <form className={loginStyle.loginForm} onSubmit={handleLogin}>
                <h1>Login</h1>

                {error && <p className={loginStyle.error}>{error}</p>}

                <div className={loginStyle.inputGroup}>
                    <IoIosMail className={loginStyle.icon} />
                    <input type="email" placeholder="Enter your email..."
                        onChange={(e) => { setEmail(e.target.value); setError("") }} />
                </div>

                <div className={loginStyle.inputGroup}>
                    <RiLockPasswordFill className={loginStyle.icon} />
                    <input type={showPassword ? "text" : "password"} placeholder="Enter your password..."
                        onChange={(e) => { setPassword(e.target.value); setError("") }} />
                    <EyeIcon onClick={handleShowPassword} className={`${loginStyle.icon} ${loginStyle.eyeIcon}`} />
                </div>

                <div className={loginStyle.rememberForgot}>
                    <label>
                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                        Remember me
                    </label>
                    <Link to="/forgot-password">Forgot password?</Link>
                </div>

                <input type="submit" value="Login" className={loginStyle.loginButton} />
                <GoogleLogin
                    onError={() => {
                        setError("Google login failed. Please try again.");
                    }}
                    ux_mode="redirect" // Improve practice by using redirect mode
                    login_uri= {`${baseUrl}/api/auth/google-auth`}
                />

                <div className={loginStyle.registerLink}>
                    <p>Don't have an account? <Link to="/Register">Register</Link></p>
                </div>
            </form>
        </div>
    );
}

export default Login;
