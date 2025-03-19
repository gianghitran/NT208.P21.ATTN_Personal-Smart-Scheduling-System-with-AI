import { Link } from "react-router-dom";
import "./mytask.css";
import threebears from "../../assets/threebears.jpg";
import React, { useState } from "react";
import NavCal from "./Nav_calendar";
const Mytask = () => {
  const [showCalendar, setShowCalendar] = useState(true);

        const toggleCalendar = () => {
          setShowCalendar((prev) => !prev);
        };

  return (
    
    <div className="app-container">
      
      <div className="main-content">
        {/* Task Dashboard */}
          
        <div className="task-dashboard">
          <div className="header">
              <h2>To Do or Not Marked Done</h2>
          </div>
          <div className="task-list">
           <div className="task">
                <span className="dot yellow"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot yellow"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot red"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot yellow"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot yellow"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot red"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot yellow"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot yellow"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot blue"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot green"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot yellow"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot green"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot yellow"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot green"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot yellow"></span> Nghĩa làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot yellow"></span> Gia Nghi làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
            <div className="task">
                <span className="dot green"></span> Gia Nghi làm hết
                 <input type="checkbox" className="task-checkbox" />
            </div>
          
          </div>
        </div>

        {/* Button để ẩn/hiện Calendar */}
        <button className="toggle-btn" onClick={toggleCalendar}>
          {showCalendar ? "Hide Events" : "Show Events"}
        </button>

        {/* Calendar */}
        {showCalendar && (
          <div className="calendar">
            
            <div className="calshow">
              <div>
                <h2>Calendar</h2>
              </div>
              <div className="calendar-content">
                <div className="task-event-red">Overdue</div>
                <div className="task-event-blue">Upcoming</div>
                <div className="task-event-green">Ongoing</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mytask;
