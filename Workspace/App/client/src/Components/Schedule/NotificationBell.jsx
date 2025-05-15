import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import dayjs from 'dayjs';
import { readNotification } from '../../services/sharedEventService';
import { useSelector } from 'react-redux';
import { customToast } from '../../utils/customToast';
import styles from './NotificationBell.module.css';

const NotificationBell = ({ unreadCount, notifications, setNotifications, axiosJWT }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const user = useSelector((state) => state.auth.login?.currentUser);

  const handleToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleRead = async ( eventId ) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.eventId === eventId ? { ...n, isRead: true } : n
      )
    );
    try {
      await readNotification(user?.access_token, eventId, axiosJWT);
    } 
    catch (error) {
      customToast("Error when reading notification", "error", "bottom-right");
      setNotifications((prev) =>
        prev.map((n) =>
          n.eventId === eventId ? { ...n, isRead: false } : n
        )
      );
    }
  };

  const renderNotificationItem = (notification) => (
    <div key={notification._id} className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ""}`} 
      onClick={() => handleRead(notification.eventId)}>
      <div className={styles.message}>
        <strong>{notification.ownerName}</strong> invited you to the event{" "}
        <strong>{notification.eventName}</strong> as
        {notification.role === "editor" ? " an" : " a"} {notification.role}.
      </div>
      <div className={styles.timestamp}>
        {dayjs(notification.invitedAt).format("DD/MM/YYYY HH:mm")}
      </div>
    </div>
  );

  return (
    <div className={styles.notificationWrapper}>
      <div className={`${styles.notification} ${showDropdown ? styles.active : ""}`} onClick={handleToggle}>
        <FaBell className={`${styles.bellIcon} ${showDropdown ? styles.active : ""}`} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount}</span>
        )}
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          {notifications.length > 0 ? (
            [...notifications]
            .sort((a, b) => new Date(b.invitedAt) - new Date(a.invitedAt))
            .map(renderNotificationItem)
          ) : (
            <div className={styles.noNotifications}>No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
