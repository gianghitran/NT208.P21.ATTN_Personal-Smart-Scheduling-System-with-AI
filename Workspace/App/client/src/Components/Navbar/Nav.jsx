import "./Nav.css";
import { Link, useLocation } from "react-router-dom"; 
import { icons } from "../../assets/icon";
import threebears from "../../assets/threebears.jpg";

const Navbar = () => {
    return (  
        <nav className="nav">
            <div className="site-title">
                <img src={threebears} alt="logo"/>
                <Link to="/">Calendar</Link>
            </div>
            <ul className="menu-item">
                <CustomLink to="/Schedule" icon="date">Schedule</CustomLink>
                <CustomLink to="/Chatbox" icon="chat">Chatbox</CustomLink>
                <CustomLink to="/Report" icon="report">Report</CustomLink>
            </ul>
            <div className="tag">
                <div className="account-title">My Account</div>
                <ul className="account-menu">
                    <CustomLink to="/Mytask" icon="task">My Task</CustomLink>
                    <CustomLink to="/Myteam" icon="team">My Team</CustomLink>
                    <CustomLink to="/Myactivities" icon="activity">My Activities</CustomLink>
                </ul>
            </div>
            <div className="tag">
                <div className="system-title">System</div>
                <ul className="system-menu">
                    <CustomLink to="/Setting" icon="setting">Setting</CustomLink>
                    <CustomLink to="/Logout" icon="logout">Logout</CustomLink>
                </ul>
            </div>
        </nav>
    );
}

function CustomLink({to, icon, children, ...props}) {
    const location = useLocation();
    const isActive = location.pathname === to;
    const Icon = icons[icon];
    return (
        <li className="select ${isActive ? 'active' : ''}">
            <Icon/>
            <Link to={to} {...props}>{children}</Link>
        </li>
    );
}
 
export default Navbar;