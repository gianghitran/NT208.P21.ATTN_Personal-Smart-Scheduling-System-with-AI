import home from "./home.module.css"
import DateContainer from "../miniCalendar/DateContainer";
import { Link } from "react-router-dom";
import { Typography, Button, Container, Box, Paper } from "@mui/material";
// npm install @mui/material @emotion/react @emotion/styled
import gifAnimation from "../../assets/homepage_element.gif";
import threeBears from "../../assets/3bears.png";

const Home = () => {
    return ( 
        <div className={home.Home_byNghi}>
            {/* Mini Calendar */}
            {/* <div className={home.date_container}>
                <DateContainer/>
            </div> */}

            {/* Nội dung chính */}
            <div className={home.title_container}>
            <div className={home.title_box}>
                <h1 className={home.title_text}>The Happier Workspace</h1>
                <p className={home.subtitle_text}>Calendar. Plan. To-do list. With a little help from AI.</p>
                <Link to="/Login"><button className={home.login_button}>Login</button> </Link>
            </div>
            <div className={home.date_container}>
                <DateContainer/>
            </div> 
            </div>


            <div className={home.image}>
            <img src={gifAnimation} alt="GIF Animation" width="800px" />

            </div>


            <div className={home.Bears}>
            <img src={threeBears} alt="Bears" width="800px" />


            </div>
        </div>
        
    );
};

export default Home;
