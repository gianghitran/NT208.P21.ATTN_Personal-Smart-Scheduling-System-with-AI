import { Link } from "react-router-dom";
import mytask from './mytask.module.css'; // Import CSS Module

import threebears from "../../assets/threebears.jpg";
import React, { useState } from "react";
import NavCal from "./Nav_calendar";

const Mytask = () => {
  const [showCalendar, setShowCalendar] = useState(true);

  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  return (
    <div className={mytask.app_container}>
      <div className={mytask.main_content}>
        {/* Task Dashboard */}
        <div className={mytask.task_dashboard}>
          <div className={mytask.header}>
            <h2>To Do or Not Marked Done</h2>
          </div>
              <div className={mytask.task}>
                <span className={`${mytask.dot} ${mytask.yellow}`}></span> Nghĩa làm hết
                <input type="checkbox" className={mytask.task_checkbox} />
              </div>
              <div className={mytask.task}>
                <span className={`${mytask.dot} ${mytask.red}`}></span> Nghĩa làm hết
                <input type="checkbox" className={mytask.task_checkbox} />
              </div>
              <div className={mytask.task}>
                <span className={`${mytask.dot} ${mytask.blue}`}></span> Nghĩa làm hết
                <input type="checkbox" className={mytask.task_checkbox} />
              </div>
              <div className={mytask.task}>
                <span className={`${mytask.dot} ${mytask.green}`}></span> Nghĩa làm hết
                <input type="checkbox" className={mytask.task_checkbox} />
              </div>
        </div>

        {/* Button để ẩn/hiện Calendar */}
        <button className={mytask.toggle_btn} onClick={toggleCalendar}>
          {showCalendar ? "Hide Events" : "Show Events"}
        </button>

        {/* Calendar */}
        {showCalendar && (
          <div className={mytask.calendar}>
            <div className={mytask.calshow}>
              <div>
                <h2>Calendar</h2>
              </div>
              <div className={mytask.calendar_content}>
                <div className={mytask.task_event_red}>Overdue</div>
                <div className={mytask.task_event_blue}>Upcoming</div>
                <div className={mytask.task_event_green}>Ongoing</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mytask;
