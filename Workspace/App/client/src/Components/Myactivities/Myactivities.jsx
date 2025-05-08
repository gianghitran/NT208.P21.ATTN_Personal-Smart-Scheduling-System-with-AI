import styles from "./Myactivities.module.css";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { getEvents } from "../../redux/apiRequest";

const CATEGORY_COLORS = {
    work: "#2196F3",
    school: "#08ccc2",
    relax: "#FF9800",
    todo: "#4CAF50",
    other: "#9E9E9E"
};

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const Myactivities = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [events, setEvents] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const dayStr = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        if (!user?.userData?._id) return;

        getEvents(user.userData._id)
            .then(data => {
                const eventsInToday = data.filter(ev => {
                    const start = new Date(ev.start);
                    return (
                        start.getFullYear() === today.getFullYear() &&
                        start.getMonth() === today.getMonth() &&
                        start.getDate() === today.getDate()
                    );
                });

                setEvents(eventsInToday.map(ev => ({
                    ...ev,
                    start: new Date(ev.start),
                    end: new Date(ev.end),
                })));
            });
    }, [user, today]);

    useEffect(() => {
        const now = new Date();
        const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

        const timeout = setTimeout(() => {
            setCurrentTime(new Date());
            const interval = setInterval(() => {
                setCurrentTime(new Date());
            }, 60000);
            return () => clearInterval(interval);
        }, msToNextMinute);

        return () => clearTimeout(timeout);
    }, []);

    const now = currentTime;

    const pastEvents = events.filter(e => e.end < now);
    const ongoingEvents = events.filter(e => e.start <= now && e.end > now);
    const upcomingEvents = events.filter(e => e.start > now);

    const renderEvents = (list, label, type) => (
        <div className={styles.group}>
            <h2 className={styles.groupTitle}>{label}</h2>
            {list.length === 0 ? (
                <p className={styles.empty}>No events</p>
            ) : (
                list.map((event, idx) => {
                    let bgColor = "#bdbdbd";
                    let opacity = 0.7;
                    if (type !== "past") {
                        bgColor = CATEGORY_COLORS[event.category] || "#9E9E9E";
                        opacity = 1;
                    }
                    return (
                        <div
                            className={styles.eventBlock}
                            key={idx}
                            style={{
                                background: bgColor,
                                opacity,
                            }}
                        >
                            <div className={styles.eventTime}>
                                {event.start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} {event.end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                            </div>
                            <div className={styles.verticalLine}></div>
                            <div className={styles.eventTitleInfo}>
                                <div className={styles.eventTitleCategory}>
                                    <div className={styles.eventTitle}>{event.title}</div>
                                    <div className={styles.eventCategory}>{capitalize(event.category)}</div>
                                </div>
                                <div className={styles.eventDesc}>{event.description}</div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <h1 className={styles.header}>My Activities</h1>
                <div className={styles.header}>{dayStr}</div>
            </div>
            {renderEvents(pastEvents, "Past Events", "past")}
            {renderEvents(ongoingEvents, "Ongoing Events", "ongoing")}
            {renderEvents(upcomingEvents, "Upcoming Events", "upcoming")}
        </div>
    );
};

export default Myactivities;
