import navs from "./navstyle.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../../assets/icon";
import { logoutUser } from "../../redux/apiRequest";
import { logoutSuccess } from "../../redux/authSlice";
import { createAxios } from "../../utils/axiosConfig";
import { customToast } from "../../utils/customToast";
import threebears from "../../assets/threebears.jpg";
const Navbar = () => {
    const menu_icon = icons["menu"];
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = createAxios(user, dispatch, logoutSuccess);

    const handleLogout = () => {
        const res = logoutUser(dispatch, navigate);
        try {
            if (res) {
                customToast("Logout successfully!", "success", "top-right", 3000);
            }
        }
        catch (error) {
            customToast("Logout failed!", "error", "top-right", 3000);
        }
    }
    return (  
        <>  
            <nav className={navs.navmobile}>
                <Link to="#" className={navs.menubutton} onClick={openMenu}>
                    <svg className={navs.icon} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                </Link>
            </nav>
            <nav className={navs.nav}>
                <div className={navs.sitetitle}>
                    <img src={threebears} alt="logo"/>
                    <Link to="/" className={navs.appname}>Calendar</Link>
            
                </div>
                <ul className={navs.mainitem}>
                    <CustomLink to="/Schedule" icon="date">Schedule</CustomLink>
                    <CustomLink to="/Chatbox" icon="chat">Chatbox</CustomLink>
                    <CustomLink to="/Myactivities" icon="activity">My Activities</CustomLink>
                </ul>
                <div className={`${navs.tag} ${navs.account}`}>
                    <div className={navs.title}>My Account</div>
                    <ul className={navs.accountmenu}>
                        <CustomLink to="/Mytask" icon="task">My Task</CustomLink>
                        <CustomLink to="/Myteam" icon="team">My Team</CustomLink>
                        {/* <CustomLink to="/Myactivities" icon="activity">My Activities</CustomLink> */}
                    </ul>
                </div>
                <div className={`${navs.tag} ${navs.system}`}>
                    <div className={navs.title}>System</div>
                    <ul className={navs.systemmenu}>
                        <CustomLink to="/Setting" icon="setting">Setting</CustomLink>
                        <CustomLink to="/" icon="logout" onClick={handleLogout}>Logout</CustomLink>
                    </ul>
                </div>
            </nav>
        </>
    );
}

function CustomLink({to, icon, children, ...props}) {
    const location = useLocation();
    const isActive = location.pathname === to;
    const Icon = icons[icon];
    return (
        <Link to={to} {...props} className={navs.link}>
            <li className={`${navs.select} ${isActive ? navs.active : ""}`}>
                    {Icon && <Icon className={navs.icon}/>}
                    {children}
            </li>
        </Link>
    );
}

function openMenu() {
    document.querySelector(`.${navs.nav}`).classList.toggle(navs.show);
}
 
export default Navbar;