import loginStyle from "./Login.module.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, loginGoogle } from "../../redux/apiRequest";
import { GoogleLogin } from "@react-oauth/google";
import { IoIosMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const user = {
            email: email,
            password: password
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

    const handleSuccess = async (credentialResponse) => {
        try {
            const response = await loginGoogle(credentialResponse, dispatch, navigate);
            if (response && !response.success) {
                setError(response.message);
            }
        } catch (error) {
            setError("Google login failed. Please try again.");
        }
    }

    return (
        <div className={loginStyle.Wrapper}>
            <form className={loginStyle.loginForm} onSubmit={handleLogin}> 
                <h1>Login</h1>

                {error && <p className={loginStyle.error}>{error}</p>}

                <div className={loginStyle.inputGroup}>
                    <IoIosMail className={loginStyle.icon} />
                    <input type="email" placeholder="Enter your email..." 
                        onChange={(e) => {setEmail(e.target.value); setError("")}} />
                </div>

                <div className={loginStyle.inputGroup}>
                    <RiLockPasswordFill className={loginStyle.icon} />
                    <input type="password" placeholder="Enter your password..."
                        onChange={(e) => {setPassword(e.target.value); setError("")}}/>
                </div>

                <div className={loginStyle.rememberForgot}>
                    <label><input type="checkbox"/> Remember me</label>
                    <Link to="#">Forgot password?</Link>
                </div>

                <input type="submit" value="Login" className={loginStyle.loginButton}/>
                <GoogleLogin
                    onSuccess={handleSuccess}
                />

                <div className={loginStyle.registerLink}>
                    <p>Don't have an account? <Link to="/Register">Register</Link></p>
                </div>
            </form>
        </div>
    );
}

export default Login;
