import React, { useState } from "react";
import "./mytask.module.css";

const NavCal = ({ toggleCalendar }) => {
  return (
    <nav className={mytask.navbar}>
      <button className={mytask.menu_toggle} onClick={toggleCalendar}>

      </button>
      <h1></h1>
    </nav>
  );
};

export default NavCal;