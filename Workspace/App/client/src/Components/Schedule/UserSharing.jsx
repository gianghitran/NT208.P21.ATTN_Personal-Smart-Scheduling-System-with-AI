import styles from "./UserSharing.module.css";
import { useEffect, useState, useRef } from "react";
import { getInvitedUsersByEvent, updateRole, shareEvents } from "../../services/sharedEventService";
import { customToast } from "../../utils/customToast";

const UserSharing = ( { selectedEvent, setEvents, access_token, axiosJWT } ) => {
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [newEmail, setNewEmail] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const lastFetchedId = useRef(null);
    const eventId = selectedEvent.id;

    const fetchInvitedUsers = async () => {
        const { invitedUsers = [], ownerEmail, isOwner } = await getInvitedUsersByEvent(access_token, eventId, axiosJWT);

        const fullList = [
            { email: ownerEmail, role: "owner" },
            ...invitedUsers.filter(u => u.email !== ownerEmail),
        ];

        setInvitedUsers(fullList);
        setIsOwner(isOwner); 
    };

    useEffect(() => {
        if (selectedEvent?.isShared && selectedEvent?.id && selectedEvent.id !== lastFetchedId.current) 
        {
            fetchInvitedUsers();
            lastFetchedId.current = selectedEvent.id;
        }
    }, [access_token, selectedEvent?.id, axiosJWT]);

    const handleRoleChange = async (email, newRole) => {
        const updatedUsers = invitedUsers.map(user =>
            user.email === email ? { ...user, role: newRole } : user
        );

        try {
            const updatedUser = updatedUsers.find(user => user.email === email);
            const response = await updateRole(access_token, updatedUser, eventId, axiosJWT);
            if (response.status === 200) {
                setInvitedUsers(updatedUsers);
                customToast("Role updated successfully", "success", "bottom-right");
            } else {
                customToast("Failed to update role", "error", "bottom-right");
            }
        }
        catch (error) {
            customToast("Error updating role", "error", "bottom-right");
        }
    };

    const handleInvite = async () => {
        if (!newEmail.trim()) return;
        const alreadyInvited = invitedUsers.some(user => user.email === newEmail);
        if (alreadyInvited) return customToast("User already invited", "error", "bottom-right");

        const newUser = { email: newEmail, role: "viewer" }; // mặc định là viewer

        try {
            const response = await shareEvents(access_token, newEmail, eventId, axiosJWT);
            if (response.status === 201) {
                fetchInvitedUsers();
                setEvents(prev => prev.map(event => {
                    if (event.id === eventId) {
                        return {
                            ...event,
                            isShared: true,
                        };
                    }
                    return event; 
                }));

                customToast(response.data.message, "success", "bottom-right");
            }
            else {
                customToast(response.data.message, "error", "bottom-right");
            }
        }
        catch (error) {
            customToast(error, "error", "bottom-right");
        }
        setNewEmail("");
    };

    return (
        <div className={styles.container}>
            <h2 style={{ fontWeight: "bold", color: "#7b5410", marginTop: "10px" }}>User Sharing</h2>
            <div className={styles.formGroup}>
                <label>Enter email:</label>
                <input
                    type="email"
                    placeholder="Other user's email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <button onClick={handleInvite}>Invite</button>
            </div>

            <div className={styles.userList}>
                <h3 style={{ color: "#7b5410", fontWeight: "bold", marginBottom: "0.5rem"}}>Invited Users</h3>
                <ul>
                   {invitedUsers.map((user, index) => (
                        <li key={index} className={styles.userItem}>
                            <span className={styles.email}>{user.email}</span>

                            {user.role === "owner" ? (
                                <span className={styles.roleTag}> (owner)</span>
                            ) : !(user.status === "accepted") ? (
                                <span className={styles.roleTag}> (pending)</span>
                            ) : (isOwner) ? (
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                >
                                    <option value="viewer">Viewer</option>
                                    <option value="editor">Editor</option>
                                </select>
                            ) : (
                                    <span className={styles.roleTag}> ({user.role})</span>
                                )
                            };
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserSharing;
