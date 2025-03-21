import registerStyle from './Register.module.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/apiRequest';
import { FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";


const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRegister = (e) => {
        e.preventDefault();
        const user = {
            full_name: fullName,
            email: email,
            password: password
        }
        registerUser(user, dispatch, navigate);
    }

    return (
        <div className={registerStyle.Wrapper}>
            <form className={registerStyle.registerForm} onSubmit={handleRegister}>
                <h1>Register</h1>
                <div className={registerStyle.inputGroup}>
                    <FaUser className={registerStyle.icon} />
                    <input type="text" placeholder="Enter your full name..."
                        onChange={(e) => {setFullName(e.target.value)}}/>
                </div>

                <div className={registerStyle.inputGroup}>
                    <IoIosMail className={`${registerStyle.icon} ${registerStyle.mail}`} />
                    <input type="email" placeholder="Enter your email..."
                        onChange={(e) => {setEmail(e.target.value)}}/>
                </div>

                <div className={registerStyle.inputGroup}>
                    <RiLockPasswordFill className={`${registerStyle.icon} ${registerStyle.password}`} />
                    <input type="password" placeholder="Enter your password..."
                        onChange={(e) => {setPassword(e.target.value)}}/>
                </div>

                <input type="submit" value="Register" className={registerStyle.registerButton}/>

                <div className={registerStyle.loginLink}>
                    <p>Already have an account? <Link to="/Login">Login</Link></p>
                </div>
            </form>
        </div>
    )
};

export default Register;