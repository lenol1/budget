import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./components/styles/App.css";
import Login from "./components/access/Login.js";
import Signup from "./components/access/Signup.js";
import Report from "./components/home/Report.js";
import Home from "./components/home/Main.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import './i18n';
import ThemeSwitcher from "./components/styles/ThemeSwitcher.js";

/**
* Main Application Component
*
* This component is the root of the application, handling routing and rendering of different pages based on the URL.
*
* @author len_oli 
*
* @returns {React.ReactNode} - JSX element representing the entire application
*/

function App() {
  return (
    <Router>
      <div>
        <ThemeSwitcher/>
        <Routes>
          <Route path="/" element={<Header variant="login/signup" />} />
          <Route path="/signup" element={<Header variant="login/signup" />} />
          <Route path="/report" element={<Header variant="home" />} />
          <Route path="/home" element={<Header variant="home" />} />
        </Routes>
      </div>
      <div>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/report" element={<Report />} />
          <Route path="/home" element={<Home />} />
        </Routes><br /> <br />
        <Footer />
      </div>
    </Router>
  );
}

export default App;