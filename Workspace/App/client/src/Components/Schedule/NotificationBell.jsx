import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import dayjs from 'dayjs';
import { readNotification, acceptInvite, declineInvite } from '../../services/sharedEventService';
import { useSelector } from 'react-redux';
import { customToast } from '../../utils/customToast';
import moment from 'moment';
import styles from './NotificationBell.module.css';
import Modal from "react-modal";

const NotificationBell = ({ unreadCount, notifications, setNotifications, setUnreadCount, axiosJWT, onAccept }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentInviteId, setCurrentInviteId] = useState(null);
  const user = useSelector((state) => state.auth.login?.currentUser);

  const currentNotification = notifications.find(n => n._id === currentInviteId);

  // Hàm dùng để mở/đóng dropdown
  const handleToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  // Hàm dùng để đọc notification và cập nhật trạng thái isRead
  const handleRead = async ( inviteId, readType, isRead ) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === inviteId ? { ...n, [readType]: true } : n
      )
    );
    
    setUnreadCount((prev) => prev - 1);

    try {
      if (!isRead)
        await readNotification(user?.access_token, inviteId, readType, axiosJWT);
    } 
    catch (error) {
      customToast("Error when reading notification", "error", "bottom-right");
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === inviteId ? { ...n, isRead: false } : n
        )
      );
    }
  };

  // Hàm dùng để accept invite từ owner
  const handleAccept = async (inviteId) => {
    try {
      const response = await acceptInvite(user?.access_token, inviteId, axiosJWT);
      let acceptedNotification = null;
      if (response.status === 200) {
        setNotifications((prev) =>
          prev.map((n) => {
            if (n._id === inviteId) {
              acceptedNotification = { ...n, status: "accepted" };
              return acceptedNotification;
            }
            return n;
          }
        ));
        const startOfWeek = moment(acceptedNotification.start).startOf('isoWeek').toDate();
        const endOfWeek = moment(acceptedNotification.end).endOf('isoWeek').toDate();
        await onAccept?.(startOfWeek, endOfWeek, true, false, "week");
        customToast("Invite accepted", "success", "bottom-right");
      }
    }
    catch (error) {
      customToast("Error when accepting invite", "error", "bottom-right");
    }
    setModalIsOpen(false);
  }

  // Hàm dùng để decline invite từ owner
  const handleDecline = async (inviteId) => {
    try {
      const response = await declineInvite(user?.access_token, inviteId, axiosJWT);
      if (response.status === 200) {
        setNotifications((prev) =>
          prev.map((n) => 
            n._id === inviteId ? { ...n, status: "declined" } : n
          )
        );
        customToast("Invite declined", "success", "bottom-right");
      }
    }
    catch (error) {
      customToast("Error when declining invite", "error", "bottom-right");
    }
    setModalIsOpen(false);
  }

  // Hàm dùng để mở modal khi click vào một notification
  const handleNotificationClick = async (notification, role) => {
    setCurrentInviteId(notification._id);
    setModalIsOpen(true);
    if (role === "invitee") {
      await handleRead(notification._id, "isRead", notification.isRead);
    }
    else {
      await handleRead(notification._id, "isReadInvitor", notification.isReadInvitor);
    }
  };

  // Hàm dùng để render một notification item
  const renderNotificationItem = (notification) => (
    <div key={notification._id} className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ""}`} 
      onClick={() => handleNotificationClick(notification, "invitee")}>
      <div className={styles.message}>
        <strong>{notification.invitorName}</strong> invited you to the event{" "}
        <strong>{notification.eventName}</strong> as
        {notification.role === "editor" ? " an" : " a"} {notification.role}.
      </div>
      <div className={styles.timestamp}>
        {dayjs(notification.invitedAt).format("DD/MM/YYYY HH:mm")} —{" "}
        {notification.status === "pending" ? "Haven't responded yet" : "Have responded"}
      </div>
    </div>
  );

  // Hàm dùng để render hiển thị response từ user được mời vào notification
  const renderResponseItem = (notification) => (
    <div
      key={notification._id}
      className={`${styles.notificationItem} ${!notification.isReadInvitor ? styles.unread : ""}`}
      onClick={() => handleNotificationClick(notification, "invitor")}
    >
      <div className={styles.message}>
        <strong>{notification.inviteeId.full_name}</strong>
        <span>{` (${notification.inviteeId.email})`}</span>{" "}
        has <strong>{notification.status}</strong> the invitation to join the event{" "}
        <strong>{notification.eventName}</strong> as
        {notification.role === "editor" ? " an" : " a"} {notification.role}.
      </div>
      <div className={styles.timestamp}>
        Responded at {dayjs(notification.respondedAt).format("DD/MM/YYYY HH:mm")}
      </div>
    </div>
  );



  // Hàm dùng để render modal khi click vào một notification gồm accept/decline button
  const confirmInviteModal = () => { 
    if (!currentNotification) return null;
    return(
      <div>
        <h2>Notification Details</h2>
        <p><strong>From:</strong> {currentNotification.invitorName || currentNotification.inviteeName}</p>
        <p><strong>Event:</strong> {currentNotification.eventName}</p>
        <p><strong>Role:</strong> {currentNotification.role}</p>
        <p><strong>Invited At:</strong> {dayjs(currentNotification.invitedAt).format("DD/MM/YYYY HH:mm")}</p>
        <p><strong>Start:</strong> {moment(currentNotification.start).format("DD/MM/YYYY HH:mm")}</p>
        <p><strong>End:</strong> {moment(currentNotification.end).format("DD/MM/YYYY HH:mm")}</p>
        {currentNotification.status === "pending" ? 
          (
            <>
            <button onClick={() => handleAccept(currentNotification._id)} className={styles.acceptBtn}>Accept</button>
            <button onClick={() => handleDecline(currentNotification._id)} className={styles.declineBtn}>Decline</button>
            <button onClick={() => setModalIsOpen(false)} className={styles.closeBtn}>Close</button>
            </>
          ) : 
          (
            <p><strong>Status:</strong> {currentNotification.status}</p>
          )
        }
      </div>
    );
  };

  return (
    <div>
      <div className={styles.notificationWrapper}>
        <div className={`${showDropdown} ? ${styles.notification.active}: ${styles.notification}`} onClick={handleToggle}>
          <FaBell className={`${showDropdown} ? ${styles.bellIcon.active} : ${styles.bellIcon}`} />
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}

          {showDropdown && (
          <div className={styles.dropdown}>
            {notifications.length > 0 ? (
              [...notifications]
              .sort((a, b) => {
                const timeA = a?.respondedAt && a.invitorId._id === user._id ? new Date(a.respondedAt) : new Date(a.invitedAt);
                const timeB = b?.respondedAt && b.invitorId._id === user._id ? new Date(b.respondedAt) : new Date(b.invitedAt);
                return timeB - timeA;
              })
              .map(notification => 
                (notification?.respondedAt && notification.invitorId._id === user._id)
                  ? renderResponseItem(notification)
                  : renderNotificationItem(notification)
              )
            ) : (
              <div className={styles.noNotifications}>No notifications</div>
            )}
          </div>)}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
        contentLabel="Notification Modal"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {currentNotification && confirmInviteModal()}
      </Modal>
    </div>
  );
};

export default NotificationBell;
