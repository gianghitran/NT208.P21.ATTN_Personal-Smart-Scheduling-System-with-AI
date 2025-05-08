import Navbar from "./Components/Navbar/Nav";
import Home from "./Components/Home/Home";
import Chatbox from "./Components/Chatbox/Chatbox";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import EmailVerification from "./Components/EmailVerification/EmailVerification";
import EmailResendVerification from "./Components/EmailVerification/EmailResendVerification";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import OAuthCallback from './Components/OAuthCallback/OAuthCallback';
import { ToastContainer } from 'react-toastify';
import { Suspense, lazy } from "react";

const Schedule = lazy(() => import("./Components/Schedule/Schedule"));
const Myactivities = lazy(() => import("./Components/Myactivities/Myactivities"));
const Mytask = lazy(() => import("./Components/Mytask/Mytask"));
const Myteam = lazy(() => import("./Components/Myteam/Myteam"));
const Setting = lazy(() => import("./Components/Setting/Setting"));

function App() {
  const isLoggedIn = useSelector((state) => state.auth.login.currentUser);

  return (
    <>
      <div className="app-layout">
        {/* <Navbar/> */}
        {isLoggedIn !== null && <Navbar />}

        <Routes>
          {isLoggedIn === null && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/email-verify" element={<EmailVerification />} />
                    <Route path="/email-resend-verify" element={<EmailResendVerification/>} />
            </>
          )}

          <Route element={<ProtectedRoute />}>
            <Route path="/login" element={<Navigate to="/Schedule" />} />
            <Route path="/register" element={<Navigate to="/Schedule" />} />
            <Route path="/" element={<Navigate to="/Schedule" />} />
            <Route
              path="/Schedule"
              element={
                <Suspense fallback={<div>Loading calendar...</div>}>
                  <Schedule />
                </Suspense>
              }
            />
            <Route
              path="/Chatbox"
              element={
                <Suspense fallback={<div>Loading Chatbox...</div>}>
                  <Chatbox />
                </Suspense>
              }
            />
            {/* <Route path="/Chatbox" element={<Chatbox />} /> */}
            <Route
              path="/Myactivities"
              element={
                <Suspense fallback={<div>Loading activities...</div>}>
                  <Myactivities />
                </Suspense>
              }
            />
            <Route
              path="/Mytask"
              element={
                <Suspense fallback={<div>Loading tasks...</div>}>
                  <Mytask />
                </Suspense>
              }
            />
            <Route
              path="/Myteam"
              element={
                <Suspense fallback={<div>Loading team...</div>}>
                  <Myteam />
                </Suspense>
              }
            />
            <Route
              path="/Setting"
              element={
                <Suspense fallback={<div>Loading settings...</div>}>
                  <Setting />
                </Suspense>
              }
            />
          </Route>

          <Route path="/oauth2callback" element={<OAuthCallback />} />
        </Routes>
      </div>
      <ToastContainer />
    </>
  );
}

export default App
