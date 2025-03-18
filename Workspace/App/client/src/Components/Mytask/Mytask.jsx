import React from "react";
import { Link } from "react-router-dom";
import "./mytask.css";
import threebears from "../../assets/threebears.jpg";

const Mytask = () => {
  return (
    <div className="app-container">
      <div className="mytask">
      <div className="site-title">
      {/* <img src={threebears} alt="logo"/> */}
      {/* <Link to="/">My Task</Link> */}
      </div>
        {/* <nav>
            
          <ul>
            <li><Link to="/">My Task</Link></li>
            <li><Link to="/notifications">🔔 Notifications</Link></li>
            <li><Link to="/goals">🎯 Goals</Link></li>
          </ul>
        </nav> */}
        
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Task Dashboard */}
        <div className="header">
            <h2>To Do or Not Marked Done</h2>
          </div>
        <div className="task-dashboard">
          
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

        {/* Calendar */}
        <div className="calendar">
        <div>
                <h2>Calendar</h2>
            </div>
          <div className="calendar-content">
            
            <div className="task-event-red">Overdue</div>
            <div className="task-event-blue">Upcoming</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>

            <div className="task-event-green">Ongoing</div>

            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>
            <div className="task-event-green">Ongoing</div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Mytask;
