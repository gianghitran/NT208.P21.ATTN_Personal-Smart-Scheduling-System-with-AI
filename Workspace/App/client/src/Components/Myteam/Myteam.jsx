import React, { useEffect, useState } from "react";
import styles from "./Myteam.module.css";
import { useSelector } from "react-redux";
import { getInviteEvents } from "../../services/sharedEventService";
import moment from "moment";

const Myteam = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!user?.access_token) return;
            const data = await getInviteEvents(user.access_token);
            // Lọc các sự kiện đã accept
            const accepted = (data.invites || []).filter(ev => ev.status === "accepted");
            setEvents(accepted);
        };
        fetchEvents();
    }, [user?.access_token]);

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <h2 className={styles.header}>My Team</h2>
            </div>
            {events.length === 0 ? (
                <div className={styles.empty}>You have not joined any colaborative events!</div>
            ) : (
                <div>
                    {events.map(event => (
                        <div key={event._id} className={styles.eventBlock}>
                            <div className={styles.eventTime}>
                                <div>{moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}</div>
                                <div>{moment(event.start).format("DD/MM/YYYY")}</div>
                            </div>
                            <div className={styles.verticalLine}></div>
                            <div className={styles.eventTitleInfo}>
                                <div className={styles.eventTitleCategory}>
                                    <div className={styles.eventTitle}>{event.title}</div>
                                    <div className={styles.eventCategory}>{event.category}</div>
                                </div>
                                <div className={styles.eventDesc}>{event.description}</div>
                                <div className={styles.participants}>
                                    <span className={styles.participantLabel}>Người tham gia:</span>
                                    <ul>
                                        {event.participants?.map((p, idx) => (
                                            <li key={idx} className={styles.participantItem}>
                                                <span className={styles.participantName}>{p.full_name}</span>
                                                <span className={styles.participantEmail}>({p.email})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Myteam;