import schedule from "./Schedule.module.css"
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const events = [
    { title: "Meeting", startDay: 1, endDay: 2, startHour: 9, endHour: 11, color: "lightblue" },
    { title: "Lunch", startDay: 3, endDay: 4, startHour: 12, endHour: 13, color: "lightgreen" },
    { title: "Workout", startDay: 5, endDay: 7, startHour: 18, endHour: 20, color: "lightcoral" },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const formatHour = (hour) => {
    const displayHour = hour % 12 || 12;
    return `${displayHour.toString().padStart(2, "0")}:00 ${hour < 12 ? "AM" : "PM"}`;
};

const Schedule = () => {
    const [viewMode, setViewMode] = useState("week");
    const [currentDayIndex, setCurrentDayIndex] = useState(0);

    const handlePreviousDay = () => {
        setCurrentDayIndex((prev) => (prev > 0 ? prev - 1 : 6));
    };

    const handleNextDay = () => {
        setCurrentDayIndex((prev) => (prev < 6 ? prev + 1 : 0));
    };

    const handleModeChange = (mode) => {
        setViewMode(mode);
    };

    const [draggedEvent, setDraggedEvent] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);
    const [eventDetails, setEventDetails] = useState({
        title: "",
        startDay: "",
        startHour: "",
        endDay: "",
        endHour: "",
        color: "",
    });

    // Khi bắt đầu kéo sự kiện
    const onDragStart = (event, item) => {
        event.dataTransfer.setData("event", JSON.stringify(item));
        setDraggedEvent(item);
    };

    // Khi thả sự kiện vào ô lịch
    const onDrop = (event, dayIndex, hourIndex) => {
        event.preventDefault();
        const eventData = JSON.parse(event.dataTransfer.getData("event"));

        setEventDetails({
            ...eventData,
            startDay: dayIndex,
            startHour: hourIndex,
            endDay: dayIndex,
            endHour: hourIndex + 1, // Giả sử mặc định sự kiện kéo dài 1 giờ
        });

        setShowEventForm(true); // Hiển thị hộp thoại nhập thông tin
    };

    return (
        <div className={`${schedule.container_sch} ${viewMode === "day" ? schedule.day_mode : ""}`}>
            <div className={schedule.content}>
                <div className={schedule.choice}>
                    <div className={schedule.option_box}>
                        <div className={schedule.option} onClick={() => handleModeChange("day")}>Day</div>
                        <div className={schedule.option} onClick={() => handleModeChange("week")}>Week</div>
                        <div className={schedule.option}>Month</div>
                        <div className={schedule.option}>Year</div>
                    </div>
                    <div className={schedule.search}>
                        <span className={schedule.search_icon}>🔍</span>
                        <input className={schedule.search_box} type="text" row="30" column="70" placeholder="Search" />
                    </div>
                </div>

                <div className={schedule.box_title}>
                    <h2><span className={schedule.title}>March</span> 2025</h2>
                    <div className={schedule.box_filter}>
                        <div className={`${schedule.filter} ${schedule.personal}`}>
                            <input type="checkbox" className={schedule.task_checkbox} />Personal
                        </div>
                        <div className={`${schedule.filter} ${schedule.work}`}>
                            <input type="checkbox" className={schedule.task_checkbox} />Work
                        </div>
                        <div className={`${schedule.filter} ${schedule.school}`}>
                            <input type="checkbox" className={schedule.task_checkbox} />School
                        </div>
                        <div>
                            <button className={schedule.add}>+</button>
                        </div>
                    </div>
                </div>

                <div className={schedule.week_header}>
                    <div className={schedule.time_placeholder}></div>
                    {viewMode === "day" ? (
                        <div className={schedule.day_navigation}>
                            <button className={schedule.nav_button} onClick={handlePreviousDay}>&lt;</button>
                            <div className={schedule.day}>{daysOfWeek[currentDayIndex]}</div>
                            <button className={schedule.nav_button} onClick={handleNextDay}>&gt;</button>
                        </div>
                    ) : (
                        daysOfWeek.map((day, index) => (
                            <div key={index} className={schedule.day}>{day}</div>
                        ))
                    )}
                </div>

                <div className={schedule.calendar_container}>
                    <div className={schedule.calendar_contents}>
                        <div className={schedule.time_list}>
                            {[...Array(24)].map((_, hour) => (
                                <div key={hour} className={schedule.time}>
                                    {formatHour(hour)}
                                </div>
                            ))}
                        </div>

                        <div className={schedule.grid}>
                            {[...Array(7 * 24)].map((_, index) => (
                                <div key={index} className={schedule.cell}></div>
                            ))}

                            {events.map((event, index) => (
                                (viewMode === "week" || (viewMode === "day" && event.startDay <= currentDayIndex && event.endDay >= currentDayIndex)) && (
                                    <div
                                        key={index}
                                        className={schedule.event}
                                        style={{
                                            backgroundColor: event.color,
                                            gridColumn: viewMode === "day" ? "1 / 2" : `${event.startDay + 1} / ${event.endDay + 2}`,
                                            gridRow: `${event.startHour + 1} / span ${event.endHour - event.startHour}`,
                                            width: "100%",
                                            height: `${(event.endHour - event.startHour) * 40}px`
                                        }}
                                    >
                                        {`${event.startHour > 12 ? event.startHour - 12 : event.startHour} ${event.startHour > 12 ? "PM" : "AM"} - 
                                        ${event.endHour > 12 ? event.endHour - 12 : event.endHour} ${event.endHour > 12 ? "PM" : "AM"}`} <br /> {event.title}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Schedule;
