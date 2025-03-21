import { useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import styles from "./Schedule.module.css";
import Modal from "react-modal";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const initialEvents = [
  { id: 1, title: "Math Class", start: new Date(2025, 2, 20, 10, 0), end: new Date(2025, 2, 20, 12, 0), category: "school" },
  { id: 2, title: "Work Meeting", start: new Date(2025, 2, 21, 14, 0), end: new Date(2025, 2, 21, 16, 0), category: "work" },
  { id: 3, title: "Yoga Class", start: new Date(2025, 2, 22, 18, 0), end: new Date(2025, 2, 22, 19, 30), category: "relax" },
];

export default function MyCalendar() {
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), category: "work" });
  const [selectedCategories, setSelectedCategories] = useState(["work", "school", "relax"]);

  const onEventDrop = ({ event, start, end }) => {
    setEvents(events.map(e => e.id === event.id ? { ...e, start, end } : e));
    alert(`Sự kiện "${event.title}" đã được di chuyển!`);
  };

  const onEventResize = ({ event, start, end }) => {
    setEvents(events.map(e => e.id === event.id ? { ...e, start, end } : e));
    alert(`Sự kiện "${event.title}" đã được thay đổi kích thước!`);
  };


  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: "", start, end, category: "work" });
    setModalType("add");
    setModalIsOpen(true);
  };

  const handleAllChange = (event) => {
    const checked = event.target.checked;
    setSelectedCategories(checked ? ["work", "school", "relax"] : []);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      return newCategories.length === 3 ? ["work", "school", "relax"] : newCategories;
    });
  };

  const handleStartChange = (e, type) => {
    let newStart = new Date(newEvent.start);
    if (type === "date") {
      newStart = new Date(e.target.value + "T" + moment(newStart).format("HH:mm"));
    } else {
      newStart = new Date(moment(newStart).format("YYYY-MM-DD") + "T" + e.target.value);
    }

    let newEnd = newEvent.end;
    if (newStart >= newEnd) {
      newEnd = new Date(newStart.getTime() + 60 * 60 * 1000); // Cộng thêm 1 giờ
    }

    setNewEvent({ ...newEvent, start: newStart, end: newEnd });
  };

  const handleEndChange = (e, type) => {
    let newEnd = new Date(newEvent.end);
    if (type === "date") {
      newEnd = new Date(e.target.value + "T" + moment(newEnd).format("HH:mm"));
    } else {
      newEnd = new Date(moment(newEnd).format("YYYY-MM-DD") + "T" + e.target.value);
    }

    if (newEvent.start >= newEnd) {
      newEnd = new Date(newEvent.start.getTime() + 60 * 60 * 1000); // Cộng thêm 1 giờ
    }

    setNewEvent({ ...newEvent, end: newEnd });
  };


  const filteredEvents = events.filter(event => selectedCategories.includes(event.category));

  const addEvent = () => {
    setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    setModalIsOpen(false);
  };

  const getEventStyle = (event) => {
    const colors = { school: "#4CAF50", work: "#2196F3", relax: "#FF9800" };
    return { style: { backgroundColor: colors[event.category], borderRadius: "8px", color: "white", padding: "5px" } };
  };

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalType, setModalType] = useState("add");

  const onSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalType("details");
    setModalIsOpen(true);
  };

  const editEvent = () => {
    setEvents(events.map(e => e.id === selectedEvent.id ? selectedEvent : e));
    setModalIsOpen(false);
  };

  const addButton = () => {
    setModalType("add");
    setModalIsOpen(true);
    setNewEvent({ title: "", start: new Date(), end: new Date(), category: "work" });
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setEventDetailsModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.add_event}>
        <button className={styles.add} onClick={() => addButton()}>+</button>
        <div className={styles.filters}>
          <h3 style={{ color: "black", fontWeight: "bold" }}>Filters</h3>
          <div className={styles.chbox} style={{ backgroundColor: "lightcoral" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.length === 3} onChange={handleAllChange} />
              <span style={{ fontWeight: "bold" }}>All</span>
            </label>
          </div>
          <div className={styles.chbox} style={{ backgroundColor: "#2196F3" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.includes("work")} onChange={() => handleCategoryChange("work")} />
              <span style={{ fontWeight: "bold" }}>Work</span>
            </label>
          </div>
          <div className={styles.chbox} style={{ backgroundColor: "#4CAF50" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.includes("school")} onChange={() => handleCategoryChange("school")} />
              <span style={{ fontWeight: "bold" }}>School</span>
            </label>
          </div>
          <div className={styles.chbox} style={{ backgroundColor: "#FF9800" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.includes("relax")} onChange={() => handleCategoryChange("relax")} />
              <span style={{ fontWeight: "bold" }}>Relax</span>
            </label>
          </div>
        </div>
      </div>

      <DnDCalendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        date={date}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={onSelectEvent}
        onNavigate={(newDate) => setDate(newDate)}
        view={view}
        onView={(newView) => setView(newView)}
        eventPropGetter={getEventStyle}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        draggableAccessor={() => true}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {modalType === "add" && (
          <div>
            <h2 style={{ fontWeight: "bold", color: "#7b5410" }}>Add Event</h2>
            <div className={styles.formGroup}>
              <label>Title:</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <div className={styles.formGroup}>
                <label>Start Date:</label>
                <input
                  type="date"
                  value={moment(newEvent.start).format("YYYY-MM-DD")}
                  onChange={(e) => handleStartChange(e, "date")}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Start Time:</label>
                <input
                  type="time"
                  value={moment(newEvent.start).format("HH:mm")}
                  onChange={(e) => handleStartChange(e, "time")}
                />
              </div>

              <div className={styles.formGroup}>
                <label>End Date:</label>
                <input
                  type="date"
                  value={moment(newEvent.end).format("YYYY-MM-DD")}
                  onChange={(e) => handleEndChange(e, "date")}
                />
              </div>

              <div className={styles.formGroup}>
                <label>End Time:</label>
                <input
                  type="time"
                  value={moment(newEvent.end).format("HH:mm")}
                  onChange={(e) => handleEndChange(e, "time")}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Type:</label>
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                >
                  <option value="work" style={{ background: "#2196F3", color: "white" }}>Work</option>
                  <option value="school" style={{ background: "#4CAF50", color: "white" }}>School</option>
                  <option value="relax" style={{ background: "#FF9800", color: "white" }}>Relax</option>
                </select>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={addEvent} className={styles.addButton}>Add</button>
              <button onClick={() => setModalIsOpen(false)} className={styles.closeButton}>Close</button>
            </div>
          </div>
        )}

        {modalType === "details" && selectedEvent && (
          <div>
            <h2 style={{ fontWeight: "bold", color: "#7b5410" }}>Event Details</h2>
            <div className={styles.formGroup}>
              <p><label>Title:</label> {selectedEvent.title}</p>
            </div>
            <div className={styles.formGroup}>
              <p><label>Start:</label> {moment(selectedEvent.start).format("YYYY-MM-DD HH:mm A")}</p>
            </div>
            <div className={styles.formGroup}>
              <p><label>End:</label> {moment(selectedEvent.end).format("YYYY-MM-DD HH:mm A")}</p>
            </div>
            <div className={styles.formGroup}>
              <p><label>Type:</label> {selectedEvent.category.replace(/\b\w/g, char => char.toUpperCase())}</p>
            </div>
            <button onClick={() => {
              setNewEvent(selectedEvent);
              setModalType("edit");
            }} className={styles.closeButton} style={{ backgroundColor: "#FFFF66" }}>Edit</button>
            <button onClick={() => setModalIsOpen(false)} className={styles.closeButton}>Close</button>
            <button onClick={() => handleDeleteEvent(selectedEvent.id)} className={styles.closeButton} style={{ backgroundColor: "lightcoral" }}>Delete</button>
          </div>
        )}

        {modalType === "edit" && (
          <div>
            <h2 style={{ fontWeight: "bold", color: "#7b5410" }}>Edit Event</h2>
            <div className={styles.formGroup}>
              <label>Title:</label>
              <input
                type="text"
                value={selectedEvent.title}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Start Date:</label>
              <input
                type="date"
                value={moment(selectedEvent.start).format("YYYY-MM-DD")}
                onChange={(e) => handleStartChange(e, "date")}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Start Time:</label>
              <input
                type="time"
                value={moment(selectedEvent.start).format("HH:mm")}
                onChange={(e) => handleStartChange(e, "time")}
              />
            </div>

            <div className={styles.formGroup}>
              <label>End Date:</label>
              <input
                type="date"
                value={moment(selectedEvent.end).format("YYYY-MM-DD")}
                onChange={(e) => handleEndChange(e, "date")}
              />
            </div>

            <div className={styles.formGroup}>
              <label>End Time:</label>
              <input
                type="time"
                value={moment(selectedEvent.end).format("HH:mm")}
                onChange={(e) => handleEndChange(e, "time")}
              />
            </div>
            <button onClick={editEvent} className={styles.closeButton} style={{ backgroundColor: "lightblue" }}>Save</button>
            <button onClick={() => setModalIsOpen(false)} className={styles.closeButton}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
