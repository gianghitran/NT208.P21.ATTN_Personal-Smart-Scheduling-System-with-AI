import home from "./Home.module.css"
import DateContainer from "../miniCalendar/DateContainer";
import { Typography, Button, Container, Box, Paper } from "@mui/material";
// npm install @mui/material @emotion/react @emotion/styled
import gifAnimation from "../../assets/homepage_element.gif";
const Home = () => {
    return ( 
        <div className={home.Home_byNghi}>
            {/* Mini Calendar */}
            <div className={home.date_container}>
                <DateContainer/>
            </div>

            {/* Nội dung chính */}
            <div className={home.title_container}>
            <div className={home.title_box}>
                <h1 className={home.title_text}>The Happier Workspace</h1>
                <p className={home.subtitle_text}>Write. Plan. Collaborate. With a little help from AI.</p>
                <button className={home.login_button}>Login</button>
            </div>
            </div>


            <div>
            <img src={gifAnimation} alt="GIF Animation" width="900px" />

            </div>
        </div>
        
    );
};

export default Home;
