import React, { useEffect, useState } from "react";
import styles from "./Myteam.module.css";
import { useSelector } from "react-redux";
import moment from "moment";
import { getEvents } from "../../redux/apiRequest";
import { getInviteEvents } from "../../services/sharedEventService";
import axios from "axios";

const Myteam = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [events, setEvents] = useState([]);
    const [inviteEvents, setInviteEvents] = useState([]);

    const axiosJWT = axios;

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.access_token) return;
            const now = new Date();
            const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            const [data, res] = await Promise.all([
                getEvents(user?.userData._id, now, end),
                getInviteEvents(user.access_token, axiosJWT)

            ]);
            setEvents(data);
            const accepted = (res.invites || []).filter(ev => ev.status === "accepted");
            setInviteEvents(accepted);
        };
        fetchData();
    }, [user?.access_token]);

    // Chỉ merge nếu eventId có trong data events
    const mergedEvents = inviteEvents
        .map(invite => {
            const eventId = invite.eventId?._id || invite.eventId;
            const matchedEvent = events.find(ev => ev._id === eventId);

            if (!matchedEvent) return null; // Không merge nếu không tìm thấy

            return {
                ...matchedEvent, // Ưu tiên lấy dữ liệu gốc
                inviteInfo: invite, // nếu cần giữ lại thông tin từ lời mời
            };
        })
        .filter(ev => ev !== null); // Loại bỏ những item không khớp


    const CATEGORY_COLORS = {
        work: "#2196F3",
        school: "#08ccc2",
        relax: "#FF9800",
        todo: "#4CAF50",
        other: "#9E9E9E"
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <h2 className={styles.header}>My Team</h2>
            </div>
            {mergedEvents.length === 0 ? (
                <div className={styles.empty}>You have not joined any collaborative events!</div>
            ) : (
                <div>
                    {mergedEvents.map((event, idx) => {
                        // Lấy thông tin người tham gia từ inviteInfo
                        const participants = [];
                        const { inviteInfo } = event;

                        // Owner
                        if (inviteInfo?.ownerId && inviteInfo.ownerId.full_name) {
                            participants.push({
                                full_name: inviteInfo.ownerId.full_name,
                            });
                        }
                        // Invitor
                        if (inviteInfo?.invitorId && inviteInfo.invitorId.full_name) {
                            if (!participants.some(p => p.full_name === inviteInfo.invitorId.full_name)) {
                                participants.push({
                                    full_name: inviteInfo.invitorId.full_name,
                                });
                            }
                        }
                        // Invitee (bạn)
                        if (user?.userData?.full_name) {
                            if (!participants.some(p => p.full_name === user.userData.full_name)) {
                                participants.push({
                                    full_name: user.userData.full_name,
                                });
                            }
                        }

                        let bgColor = "#bdbdbd";
                        if (event.category) {
                            bgColor = CATEGORY_COLORS[event.category] || "#9E9E9E";
                        }

                        return (
                            <div
                                className={styles.eventBlock}
                                key={event._id || idx}
                                style={{
                                    background: bgColor,
                                    opacity: 1,
                                }}
                            >
                                <div className={styles.eventTime}>
                                    {new Date(event.start).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}{" "}
                                    {new Date(event.end).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                </div>
                                <div className={styles.verticalLine}></div>
                                <div className={styles.eventTitleInfo}>
                                    <div className={styles.eventTitleCategory}>
                                        <div className={styles.eventTitle}>{event.title || <span style={{ color: "#888" }}>Không có tên</span>}</div>
                                        <div className={styles.eventCategory}>{event.category || <span style={{ color: "#888" }}>No category</span>}</div>
                                        <div className={styles.participants}>
                                            <span className={styles.participantLabel}>Participants:</span>
                                            <ul>
                                                {participants.length > 0 ? (
                                                    participants.map((p, idx) => (
                                                        <li key={idx} className={styles.participantItem}>
                                                            <span className={styles.participantName}>{p.full_name}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className={styles.participantItem} style={{ color: "#888" }}>
                                                        Event not found!
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className={styles.eventDesc}>
                                        {event.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Myteam;