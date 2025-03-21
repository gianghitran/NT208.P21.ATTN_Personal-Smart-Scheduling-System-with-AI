import loginStyle from "./Login.module.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/apiRequest";
import { IoIosMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = (e) => {
        e.preventDefault();
        const user = {
            email: email,
            password: password
        }
        loginUser(user, dispatch, navigate);
    }

    return (
        <div className={loginStyle.Wrapper}>
            <form className={loginStyle.loginForm} onSubmit={handleLogin}> 
                <h1>Login</h1>
                <div className={loginStyle.inputGroup}>
                    <IoIosMail className={loginStyle.icon} />
                    <input type="email" placeholder="Enter your email..." 
                        onChange={(e) => {setEmail(e.target.value)}}/>
                </div>

                <div className={loginStyle.inputGroup}>
                    <RiLockPasswordFill className={loginStyle.icon} />
                    <input type="password" placeholder="Enter your password..."
                        onChange={(e) => {setPassword(e.target.value)}}/>
                </div>

                <div className={loginStyle.rememberForgot}>
                    <label><input type="checkbox"/> Remember me</label>
                    <Link to="#">Forgot password?</Link>
                </div>

                <input type="submit" value="Login" className={loginStyle.loginButton}/>

                <div className={loginStyle.registerLink}>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </form>
        </div>
    );
}

export default Login;
