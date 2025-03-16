import Navbar from "./Components/Navbar/Nav";
import Home from "./Components/Home/Home";
import Chatbox from "./Components/Chatbox/Chatbox";
import Report from "./Components/Report/Report";
import Mytask from "./Components/Mytask/Mytask";
import Myteam from "./Components/Myteam/Myteam";
import Myactivities from "./Components/Myactivities/Myactivities";
import Setting from "./Components/Setting/Setting";
import Schedule from "./Components/Schedule/Schedule";
import { Route, Routes } from "react-router-dom";
import './App.css';

function App() {

    return(
      <>
        <Navbar/>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route exact path="/Schedule" element={<Schedule/>} />
            <Route path="/chatbox" element={<Chatbox/>} />
            <Route path="/report" element={<Report/>} />
            <Route path="/mytask" element={<Mytask/>} />
            <Route path="/myteam" element={<Myteam/>} />
            <Route path="/myactivities" element={<Myactivities/>} />
            <Route path="/setting" element={<Setting/>} />
          </Routes>
        </div>
      </>
    );
}

export default App
