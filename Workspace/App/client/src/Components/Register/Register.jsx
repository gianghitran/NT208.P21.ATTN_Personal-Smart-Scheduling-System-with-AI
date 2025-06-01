import registerStyle from './Register.module.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/apiRequest';
import { FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { customToast } from '../../utils/customToast';
import { toast } from 'react-toastify';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const user = {
            full_name: fullName,
            email: email,
            password: password
        }
        
        
        try {
            const response = await registerUser(user, dispatch, navigate);
            
            if (response && response.message) {
                setError(response.message);
                customToast(response.message, "error");
            } else {
                customToast("Registration successful! Please verify your email.", "success");
            }
        } catch (error) {
            setError("An unexpected error occurred.");
        }
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const EyeIcon = showPassword ? FaEyeSlash : FaEye;

    return (
        <div className={registerStyle.Wrapper}>
            <form className={registerStyle.registerForm} onSubmit={handleRegister}>
                <h1>Register</h1>

                {error && <p className={registerStyle.error}>{error}</p>}

                <div className={registerStyle.inputGroup}>
                    <FaUser className={registerStyle.icon} />
                    <input type="text" placeholder="Enter your full name..."
                        onChange={(e) => {setFullName(e.target.value); setError("")}}/>
                </div>

                <div className={registerStyle.inputGroup}>
                    <IoIosMail className={`${registerStyle.icon} ${registerStyle.mail}`} />
                    <input type="email" placeholder="Enter your email..."
                        onChange={(e) => {setEmail(e.target.value); setError("")}}/>
                </div>

                <div className={registerStyle.inputGroup}>
                    <RiLockPasswordFill className={`${registerStyle.icon} ${registerStyle.password}`} />
                    <input type={showPassword?"text":"password"} placeholder="Enter your password..." minLength="8"
                        onChange={(e) => {setPassword(e.target.value); setError("")}}/>
                    <EyeIcon className={`${registerStyle.icon} ${registerStyle.eyeIcon}`} onClick={handleShowPassword} />
                </div>

                <div className={registerStyle.inputGroup}>
                    <RiLockPasswordFill className={`${registerStyle.icon} ${registerStyle.password}`} />
                    <input type={showPassword?"text":"password"} placeholder="Confirm your password..." minLength="8"
                        onChange={(e) => {setConfirmPassword(e.target.value); setError("")}}/>
                    <EyeIcon className={`${registerStyle.icon} ${registerStyle.eyeIcon}`} onClick={handleShowPassword} />
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