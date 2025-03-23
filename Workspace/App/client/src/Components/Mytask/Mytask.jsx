import { Link } from "react-router-dom";
import mytask from './mytask.module.css'; // Import CSS Module

import threebears from "../../assets/threebears.jpg";
import React, { useState, useEffect } from "react";
import NavCal from "./Nav_calendar";
import { getEvents, saveEvents } from "../../redux/apiRequest";
import { useSelector, useDispatch } from "react-redux";
import { createAxios } from "../../utils/axiosConfig";
import { loginSuccess } from "../../redux/authSlice";
import Modal from "react-modal";
import moment from "moment";

const Mytask = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const user = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const access_token = user?.access_token;

  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  const getEvent = async () => {
    const data = await getEvents(user?.userData._id);
    setEvents(data);
  };

  useEffect(() => {
    getEvent();
  }, []);

  const todoEvents = events
    .filter(event => event.category === "todo" && !event.completed)
    .sort((a, b) => new Date(a.end) - new Date(b.end));
  const completedEvents = events.filter(event => event.completed);

  const toggleTaskCompletion = async (eventId) => {
    const updatedEvents = events.map(event => {
      if (event._id === eventId) {
        event.completed = !event.completed;
      }
      return event;
    });
    setEvents(updatedEvents);
    const eventToUpdate = updatedEvents.find(event => event._id === eventId);
    await saveEvents(eventToUpdate, eventId, access_token, axiosJWT);
  };

  const handleTaskClick = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  return (
    <div className={mytask.app_container}>
      <div className={mytask.main_content}>
        {/* Task Dashboard */}
        <div className={mytask.task_dashboard}>
          <div className={mytask.header}>
            <h2>To Do or Not Marked Done</h2>
          </div>
          {todoEvents.map(event => (
            <div key={event._id} className={mytask.task} onClick={() => handleTaskClick(event)}>
              <span className={new Date(event.end) > new Date() ? `${mytask.dot} ${mytask.green}` : `${mytask.dot} ${mytask.red}`}></span> {event.title}
              <input
                type="checkbox"
                className={mytask.task_checkbox}
                checked={event.completed || false} // Đảm bảo giá trị luôn được xác định
                onChange={() => toggleTaskCompletion(event._id)}
              />
            </div>
          ))}
        </div>

        {/* Button để ẩn/hiện Calendar */}
        <button className={mytask.toggle_btn} onClick={toggleCalendar}>
          {showCalendar ? "Hide" : "Completed Tasks"}
        </button>

        {/* Calendar */}
        {showCalendar && (
          <div className={mytask.calendar}>
            <div className={mytask.calshow}>
              <div>
                <h2>Completed Tasks</h2>
              </div>
              <div className={mytask.calendar_content}>
                {completedEvents.map(event => (
                  <div key={event._id} className={mytask.task} onClick={() => handleTaskClick(event)}>
                    <span className={new Date(event.end) > new Date() ? `${mytask.dot} ${mytask.green}` : `${mytask.dot} ${mytask.red}`}></span> {event.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal hiển thị chi tiết thông tin task */}
        {modalIsOpen && selectedEvent && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            ariaHideApp={false}
            className={mytask.modalContent}
            overlayClassName={mytask.modalOverlay}
          >
            <div>
              <h2 style={{ fontWeight: "bold", color: "#7b5410" }}>Event Details</h2>
              <div className={mytask.formGroup}>
                <p><label>Title:</label> {selectedEvent.title}</p>
              </div>
              <div className={mytask.formGroup}>
                <p><label>Start:</label> {moment(selectedEvent.start).format("YYYY-MM-DD HH:mm A")}</p>
              </div>
              <div className={mytask.formGroup}>
                <p><label>End:</label> {moment(selectedEvent.end).format("YYYY-MM-DD HH:mm A")}</p>
              </div>
              <div className={mytask.formGroup}>
                <p><label>Status:</label> {(selectedEvent.completed == true && moment().format("YYYY-MM-DD HH:mm A") > selectedEvent.end) ? "Exxpired" : "Valid"}</p>
              </div>
              <button onClick={() => setModalIsOpen(false)} className={mytask.closeButton}>Close</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Mytask;