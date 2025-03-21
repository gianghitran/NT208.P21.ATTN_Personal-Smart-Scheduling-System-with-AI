import Navbar from "./Components/Navbar/Nav";
import Home from "./Components/Home/Home";
import Chatbox from "./Components/Chatbox/Chatbox";
import Mytask from "./Components/Mytask/Mytask";
import Myteam from "./Components/Myteam/Myteam";
import Myactivities from "./Components/Myactivities/Myactivities";
import Setting from "./Components/Setting/Setting";
import Schedule from "./Components/Schedule/Schedule";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
    // const navigate = useNavigate();
    // const user = useSelector((state) => state.auth.currentUser);
    // const location = useLocation();

    // useEffect(() => {
    //   const publicPages = ["/Login", "/Register"];
    //   if (!user && !publicPages.includes(location.pathname)) {
    //     navigate("/Login");
    //   }
    // }, [user]);

    return(
      <>  
          <div className="app-layout">
              <Navbar/>
              <Routes>
                <Route path="/Login" element={<Login/>} />
                <Route path="/Register" element={<Register/>} />
              </Routes>
              <div className="container">
                <Routes>
                      <Route path="/" element={<Home/>} />
                      <Route path="/Schedule" element={<Schedule/>} />
                      <Route path="/Chatbox" element={<Chatbox/>} />
                      <Route path="/Myactivities" element={<Myactivities/>} />
                      <Route path="/Mytask" element={<Mytask/>} />
                      <Route path="/Myteam" element={<Myteam/>} />
                      <Route path="/Setting" element={<Setting/>} />
                </Routes>
              </div>
          </div>
      </>
    );
}

export default App
