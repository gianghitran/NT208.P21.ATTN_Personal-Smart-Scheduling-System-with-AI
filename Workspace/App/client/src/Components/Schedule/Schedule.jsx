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
  };

  const onEventResize = ({ event, start, end }) => {
    setEvents(events.map(e => e.id === event.id ? { ...e, start, end } : e));
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: "", start, end, category: "work" });
    setModalIsOpen(true);
  };

  const openModal = () => {
    const now = new Date(); // Lấy thời gian hiện tại
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // Thêm 1 giờ

    setNewEvent({
      title: "",
      start: now,
      end: oneHourLater,
      category: "work",
    });

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

  const filteredEvents = events.filter(event => selectedCategories.includes(event.category));

  const addEvent = () => {
    setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    setModalIsOpen(false);
  };

  const getEventStyle = (event) => {
    const colors = { school: "#4CAF50", work: "#2196F3", relax: "#FF9800" };
    return { style: { backgroundColor: colors[event.category], borderRadius: "8px", color: "white", padding: "5px" } };
  };

  return (
    <div className={styles.container}>
      <div className={styles.add_event}>
        <button className={styles.add} onClick={() => openModal()}>+</button>
        <div className={styles.filters}>
          <h3 style={{ color: "black", fontWeight: "bold" }}>Filters</h3>
          <div className={styles.chbox} style={{ backgroundColor: "lightcoral" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.length === 3} onChange={handleAllChange} />
              All
            </label>
          </div>
          <div className={styles.chbox} style={{ backgroundColor: "#2196F3" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.includes("work")} onChange={() => handleCategoryChange("work")} />
              Work
            </label>
          </div>
          <div className={styles.chbox} style={{ backgroundColor: "#4CAF50" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.includes("school")} onChange={() => handleCategoryChange("school")} />
              School
            </label>
          </div>
          <div className={styles.chbox} style={{ backgroundColor: "#FF9800" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.includes("relax")} onChange={() => handleCategoryChange("relax")} />
              Relax
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
        <h2 style={{ fontWeight: "bold", color: "#7b5410" }}>Add Event</h2>
        <div className={styles.field}>
          <div className={styles.formGroup}>
            <label>Title:</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Start Date:</label>
            <input
              type="date"
              value={moment(newEvent.start).format("YYYY-MM-DD")}
              onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Start Time:</label>
            <input
              type="time"
              value={moment(newEvent.start).format("HH:mm")}
              onChange={(e) => setNewEvent({
                ...newEvent,
                start: new Date(moment(newEvent.start).format("YYYY-MM-DD") + "T" + e.target.value)
              })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>End Date:</label>
            <input
              type="date"
              value={moment(newEvent.end).format("YYYY-MM-DD")}
              onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>End Time:</label>
            <input
              type="time"
              value={moment(newEvent.end).format("HH:mm")}
              onChange={(e) => setNewEvent({
                ...newEvent,
                end: new Date(moment(newEvent.end).format("YYYY-MM-DD") + "T" + e.target.value)
              })}
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
      </Modal>
    </div>
  );
}
