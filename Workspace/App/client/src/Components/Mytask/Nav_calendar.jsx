import React, { useState } from "react";
import "./mytask.css";

const NavCal = ({ toggleCalendar }) => {
  return (
    <nav className="navbar">
      <button className="menu-toggle" onClick={toggleCalendar}>

      </button>
      <h1></h1>
    </nav>
  );
};

export default NavCal;