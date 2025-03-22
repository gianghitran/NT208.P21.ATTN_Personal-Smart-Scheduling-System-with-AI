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
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
    const isLoggedIn = useSelector((state) => state.auth.login.currentUser);

    return(
      <>  
          <div className="app-layout">
              {/* <Navbar/> */}
              {isLoggedIn !== null && <Navbar/>}
              
              <Routes>
                {isLoggedIn === null && (
                  <>
                    <Route path="/" element={<Home/>} />  
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register/>} /> 
                  </>
                )}

                <Route element={<ProtectedRoute/>}> 
                    <Route path="/login" element={<Navigate to="/Schedule"/>} />
                    <Route path="/register" element={<Navigate to="/Schedule"/>} />
                    <Route path="/" element={<Navigate to="/Schedule"/>} />
                    <Route path="/Schedule" element={<Schedule/>} />
                    <Route path="/Chatbox" element={<Chatbox/>} />
                    <Route path="/Myactivities" element={<Myactivities/>} />
                    <Route path="/Mytask" element={<Mytask/>} />
                    <Route path="/Myteam" element={<Myteam/>} />
                    <Route path="/Setting" element={<Setting/>} />
                </Route>
              </Routes>
            </div>
      </>
    );
}

export default App
