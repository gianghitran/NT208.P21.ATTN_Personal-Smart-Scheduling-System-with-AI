import "./Login.css";
import { icons } from "../../assets/icon";

const Login = ({ setIsLogin }) => {
    return (
        <form className="loginform" >
            <input type="email" placeholder="Your email"/>
            <input type="password" placeholder="Your password"/>
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
