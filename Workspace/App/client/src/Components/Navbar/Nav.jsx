import "./Nav.css";
import { Link, useLocation } from "react-router-dom"; 
import { icons } from "../../assets/icon";
import threebears from "../../assets/threebears.jpg";
const Navbar = () => {
    const menu_icon = icons["menu"];
    return (  
        <>  
            <nav className="nav-mobile">
                <Link to="#" className="menu-button" onClick={openMenu}>
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                </Link>
            </nav>
            <nav className="nav">
                <div className="site-title">
                    <img src={threebears} alt="logo"/>
                    <Link to="/" className="appname">Calendar</Link>
            
                </div>
                <ul className="main-item">
                    <CustomLink to="/Schedule" icon="date">Schedule</CustomLink>
                    <CustomLink to="/Chatbox" icon="chat">Chatbox</CustomLink>
                    <CustomLink to="/Report" icon="report">Report</CustomLink>
                </ul>
                <div className="tag" id="account">
                    <div className="title">My Account</div>
                    <ul className="account-menu">
                        <CustomLink to="/Mytask" icon="task">My Task</CustomLink>
                        <CustomLink to="/Myteam" icon="team">My Team</CustomLink>
                        <CustomLink to="/Myactivities" icon="activity">My Activities</CustomLink>
                    </ul>
                </div>
                <div className="tag" id="system">
                    <div className="title">System</div>
                    <ul className="system-menu">
                        <CustomLink to="/Setting" icon="setting">Setting</CustomLink>
                        <CustomLink to="/Logout" icon="logout">Logout</CustomLink>
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
        <Link to={to} {...props} className="link">
            <li className={`select ${isActive ? 'active' : ''}`}>
                    {Icon && <Icon className="icon"/>}
                    {children}
            </li>
        </Link>
    );
}

function openMenu() {
    document.querySelector(".nav").classList.toggle("show");
}
 
export default Navbar;