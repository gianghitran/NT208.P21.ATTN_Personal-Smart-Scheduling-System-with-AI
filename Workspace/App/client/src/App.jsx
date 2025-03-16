import Navbar from "./Components/Navbar/Nav";
import Home from "./Components/Home/Home";
import Chatbox from "./Components/Chatbox/Chatbox";
import Report from "./Components/Report/Report";
import Mytask from "./Components/Mytask/Mytask";
import Myteam from "./Components/Myteam/Myteam";
import Myactivities from "./Components/Myactivities/Myactivities";
import Setting from "./Components/Setting/Setting";
import Schedule from "./Components/Schedule/Schedule";
import { Route, Routes, Router } from "react-router-dom";

function App() {

    return(
      <>
        <Navbar/>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/Schedule" element={<Schedule/>} />
            <Route path="/Chatbox" element={<Chatbox/>} />
            <Route path="/Report" element={<Report/>} />
            <Route path="/Mytask" element={<Mytask/>} />
            <Route path="/Myteam" element={<Myteam/>} />
            <Route path="/Myactivities" element={<Myactivities/>} />
            <Route path="/Setting" element={<Setting/>} />
          </Routes>
        </div>
      </>
    );
}

export default App
