import "./Schedule.css"
import { useState } from "react";


const events = [
    { title: "Meeting", startDay: 1, endDay: 2, startHour: 9, endHour: 11, color: "lightblue" },
    { title: "Lunch", startDay: 3, endDay: 4, startHour: 12, endHour: 13, color: "lightgreen" },
    { title: "Workout", startDay: 5, endDay: 7, startHour: 18, endHour: 20, color: "lightcoral" },
];

const formatHour = (hour) => {
    const displayHour = hour % 12 || 12; // 
    return `${displayHour.toString().padStart(2, "0")}:00 ${hour < 12 ? "AM" : "PM"}`;
};

const Schedule = () => {
    const [viewMode, setViewMode] = useState("week"); // Mặc định là chế độ tuần

    const handleModeChange = (mode) => {
        setViewMode(mode);
    };
    return (
        <div className={`container ${viewMode === "day" ? "day-mode" : ""}`}>
            <div className="content">

                <div className="choice">
                    <div className="option_box">
                        <div className="option" onClick={() => handleModeChange("day")}>Day</div>
                        <div className="option" onClick={() => handleModeChange("week")}>Week</div>
                        <div className="option">Month</div>
                        <div className="option br">Year</div>
                    </div>
                    <div className="search">
                        <span className="search-icon">🔍</span>
                        <input className="search-box" type="text" row="30" column="70" placeholder="Search" />
                    </div>
                </div>

                <div className="box-title">
                    <h2><span className="title">March</span> 2025</h2>
                    <div className="box-filter">
                        <div className="filter personal">
                            <input type="checkbox" className="task-checkbox" />Personal
                        </div>
                        <div className="filter work">
                            <input type="checkbox" className="task-checkbox" />Work
                        </div>
                        <div className="filter school">
                            <input type="checkbox" className="task-checkbox" />School
                        </div>
                        <button className="add">+</button>
                    </div>
                </div>

                <div className="week-header">
                    <div className="time-placeholder"></div>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
                        <div key={index} className="day">{day}</div>
                    ))}
                </div>

                <div className="calendar-container">
                    <div className="calendar-contents">
                        <div className="time-list">
                            {[...Array(24)].map((_, hour) => (
                                <div key={hour} className="time">
                                    {formatHour(hour)}
                                </div>
                            ))}
                        </div>

                        <div className="grid">
                            {[...Array(7 * 24)].map((_, index) => (
                                <div key={index} className="cell"></div>
                            ))}

                            {events.map((event, index) => (
                                <div
                                    key={index}
                                    className="event"
                                    style={{
                                        backgroundColor: event.color,
                                        gridColumn: `${event.startDay + 1} / ${event.endDay + 2}`,
                                        gridRow: `${event.startHour + 1} / ${event.endHour + 1}`,
                                        width: "100%",
                                        height: `${(event.endHour - event.startHour) * 40}px`
                                    }}
                                >
                                    {`${event.startHour > 12 ? event.startHour - 12 : event.startHour} ${event.startHour > 12 ? "PM" : "AM"} - 
                                    ${event.endHour > 12 ? event.endHour - 12 : event.endHour} ${event.endHour > 12 ? "PM" : "AM"}`} <br /> {event.title}
                                </div>
                            ))}



                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}


export default Schedule;
