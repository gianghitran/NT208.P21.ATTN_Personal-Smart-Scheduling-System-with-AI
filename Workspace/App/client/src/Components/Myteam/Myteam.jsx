import React, { useEffect, useState } from "react";
import styles from "./Myteam.module.css";
import { useSelector } from "react-redux";
import { getInviteEvents } from "../../services/sharedEventService";
import axios from "axios";

const Myteam = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [inviteEvents, setInviteEvents] = useState([]);

    const axiosJWT = axios;

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.access_token) return;
            const res = await getInviteEvents(user.access_token, axiosJWT);
            // Chỉ lấy các invite đã accept
            const accepted = (res.invites || []).filter(ev => ev.status === "accepted");
            setInviteEvents(accepted);
        };
        fetchData();
    }, [user?.access_token]);

    // Lọc tất cả inviteEvents mà user là owner, invitor hoặc invitee
    const userId = user?.userData?._id;
    const now = new Date();
    const twoMonthsLater = new Date(now);
    twoMonthsLater.setMonth(now.getMonth() + 2);

    const relatedInviteEvents = inviteEvents.filter(invite => {
        const event = invite.eventId;
        if (
            (invite.ownerId?._id === userId) ||
            (invite.invitorId?._id === userId) ||
            (invite.inviteeId?._id === userId)
        ) {
            if (event && event.start && event.end) {
                const start = new Date(event.start);
                const end = new Date(event.end);
                const isOngoing = now >= start && now <= end;
                const isUpcoming = start >= now && start <= twoMonthsLater;
                return isOngoing || isUpcoming;
            }
        }
        return false;
    });

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
            {relatedInviteEvents.length === 0 ? (
                <div className={styles.empty}>You have not joined any collaborative events!</div>
            ) : (
                <div>
                    {relatedInviteEvents.map((invite, idx) => {
                        // Lấy thông tin event
                        const event = invite.eventId && typeof invite.eventId === "object" ? invite.eventId : {};
                        const participants = [];

                        // Owner
                        if (invite.ownerId && invite.ownerId.full_name) {
                            participants.push({
                                full_name: invite.ownerId.full_name,
                                role: "Owner"
                            });
                        }
                        // Invitor
                        if (invite.invitorId && invite.invitorId.full_name) {
                            if (!participants.some(p => p.full_name === invite.invitorId.full_name)) {
                                participants.push({
                                    full_name: invite.invitorId.full_name,
                                    role: "Invitor"
                                });
                            }
                        }
                        // Invitee
                        if (invite.inviteeId && invite.inviteeId.full_name) {
                            if (!participants.some(p => p.full_name === invite.inviteeId.full_name)) {
                                participants.push({
                                    full_name: invite.inviteeId.full_name,
                                    role: "Invitee"
                                });
                            }
                        }

                        // Xác định vai trò của user
                        let userRole = "";
                        if (invite.ownerId?._id === userId) userRole = "Owner";
                        else if (invite.invitorId?._id === userId) userRole = "Invitor";
                        else if (invite.inviteeId?._id === userId) userRole = "Invitee";

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
                                    {event.start && event.end ? (
                                        <>
                                            {new Date(event.start).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}{" - "}
                                            {new Date(event.end).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                            <br />
                                            {new Date(event.start).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </>
                                    ) : "No time"}
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
                                                            <span className={styles.participantRole}> ({p.role})</span>
                                                            {p.full_name === user.userData.full_name && (
                                                                <span className={styles.role}> (You)</span>
                                                            )}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className={styles.participantItem} style={{ color: "#888" }}>
                                                        Event not found!
                                                    </li>
                                                )}
                                            </ul>
                                            <div className={styles.role}>
                                                Your role: {userRole}
                                            </div>
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