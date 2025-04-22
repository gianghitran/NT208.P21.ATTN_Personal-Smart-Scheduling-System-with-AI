import { useState, useEffect, useRef } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import styles from "./Schedule.module.css";
import Modal from "react-modal";
import { addEvents, saveEvents, getEvents, deleteEvents } from "../../redux/apiRequest";
import { useSelector } from "react-redux";
import { createAxios } from "../../utils/axiosConfig";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import Papa from "papaparse";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function MyCalendar() {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), category: "work", description: "" });
  const [selectedCategories, setSelectedCategories] = useState(["work", "school", "relax", "todo", "others"]);
  const fileInputRef = useRef(null);
  const [uploadModalIsOpen, setUploadModalIsOpen] = useState(false);

  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const renderEvents = async () => {
    const data = await getEvents(user?.userData._id);
    const items = data.map(({ _id, userId, __v, start, end, ...rest }) => ({
      id: _id,
      title: rest.title,
      start: new Date(start),
      end: new Date(end),
      category: rest.category,
      ...rest,
      resource: { description: rest.description },
    }));
    setEvents(items);
  };

  useEffect(() => {
    renderEvents();
  }, [events]);

  const onEventDrop = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end, userId: user.userData._id };
    const access_token = user?.access_token;
    const response = await saveEvents(updatedEvent, event.id, access_token, axiosJWT);
    if (response.success) {
      setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
      alert(`Sự kiện "${event.title}" đã được di chuyển!`);
    } else {
      alert("⛔ Lỗi: Không thể cập nhật sự kiện!");
    }
  };

  const onEventResize = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end, userId: user.userData._id };
    const access_token = user?.access_token;
    const response = await saveEvents(updatedEvent, event.id, access_token, axiosJWT);
    if (response.success) {
      setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
      alert(`Sự kiện "${event.title}" đã được thay đổi kích thước!`);
    } else {
      alert("⛔ Lỗi: Không thể cập nhật sự kiện!");
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: "", start, end, category: "work" });
    setModalType("add");
    setModalIsOpen(true);
  };

  const handleAllChange = (event) => {
    const checked = event.target.checked;
    setSelectedCategories(checked ? ["work", "school", "relax", "todo", "others"] : []);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      return newCategories.length === 5 ? ["work", "school", "relax", "todo", "others"] : newCategories;
    });
  };

  const filteredEvents = events.filter(event => selectedCategories.includes(event.category));

  const addEvent = async () => {
    if (newEvent.end < newEvent.start) {
      alert("⛔ Lỗi: Thời gian kết thúc phải sau thời gian bắt đầu!");
      return;
    }
    const event = {
      userId: user?.userData._id,
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      category: newEvent.category,
      description: newEvent.description
    }

    await addEvents(event);
    setModalIsOpen(false);
  };

  const saveEditedEvent = async () => {
    if (selectedEvent.end < selectedEvent.start) {
      alert("⛔ Lỗi: Thời gian kết thúc phải sau thời gian bắt đầu!");
      return;
    }

    const event = {
      userId: user?.userData._id,
      title: selectedEvent.title,
      start: selectedEvent.start,
      end: selectedEvent.end,
      category: selectedEvent.category,
      description: selectedEvent.description
    }

    const access_token = user?.access_token;

    await saveEvents(event, selectedEvent.id, access_token, axiosJWT);
    setModalIsOpen(false);
  };

  const deleteEvent = async (eventId) => {
    const access_token = user?.access_token;
    const response = await deleteEvents(eventId, user?.userData._id, access_token, axiosJWT);
    setEvents(events.filter(event => event.id !== eventId));
    setModalIsOpen(false);
  };

  const getEventStyle = (event) => {
    const colors = { school: "#08ccc2", work: "#2196F3", relax: "#FF9800", todo: "#4CAF50", others: "#9E9E9E" };
    return { style: { backgroundColor: colors[event.category], borderRadius: "8px", color: "white", padding: "5px" } };
  };

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalType, setModalType] = useState("add");

  const onSelectEvent = (event) => {
    console.log("📌 selectedEvent.resource:", event.resource);
    setSelectedEvent(event);
    setModalType("details");
    setModalIsOpen(true);
  };

  const addButton = () => {
    setModalType("add");
    setModalIsOpen(true);
    setNewEvent({ title: "", start: new Date(), end: new Date(), category: "work" });
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault(); // Ngăn trình duyệt mở file mặc định
    e.stopPropagation(); // Ngăn sự kiện lan ra ngoài

    const file = e.dataTransfer.files[0]; // Lấy file được thả
    if (!file) {
      alert("No file detected!");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().replace(/^\uFEFF/, ""),
      complete: async (result) => {
        const importedEvents = result.data.map(row => ({
          title: row.Title,
          start: moment(`${row["Start Day"]} ${row["Start Time"]}`, "YYYY-MM-DD HH:mm", true).toDate(),
          end: moment(`${row["End Day"]} ${row["End Time"]}`, "YYYY-MM-DD HH:mm", true).toDate(),
          category: row["Category"]?.toLowerCase(),
          description: row["Description"]?.trim() || "",
          userId: user?.userData._id,
        }));

        for (const event of importedEvents) {
          await addEvents(event);
        }
        renderEvents();
        alert("Import thành công!");
      },
    });
  };

  const handleUploadClick = () => {
    setUploadModalIsOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const importedEvents = result.data.map(row => ({
          title: row.Title,
          start: new Date(`${row["Start Day"]}T${row["Start Time"]}`), // Ghép ngày và giờ bắt đầu
          end: new Date(`${row["End Day"]}T${row["End Time"]}`), // Ghép ngày và giờ kết thúc
          category: row.Category,
          description: row.Description || "", // Mô tả
          userId: user?.userData._id,
        }));

        for (const event of importedEvents) {
          await addEvents(event);
        }
        renderEvents();
        alert("Upload thành công!");
      },
    });
  };

  const handleSaveClick = async () => {
    const csvData = events.map(event => ({
      Title: event.title,
      "Start Day": moment(event.start).format("YYYY-MM-DD"), // Ngày bắt đầu
      "Start Time": moment(event.start).format("HH:mm"), // Giờ bắt đầu
      "End Day": moment(event.end).format("YYYY-MM-DD"), // Ngày kết thúc
      "End Time": moment(event.end).format("HH:mm"), // Giờ kết thúc
      Category: event.category,
      Description: event.description || "" // Mô tả
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "events.csv";
    link.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.add_event}>
        <button className={styles.add} onClick={() => addButton()}>+</button>
        <div className={styles.filters}>
          <h3 style={{ color: "black", fontWeight: "bold" }}>Filters</h3>
          <div className={styles.chbox} style={{ backgroundColor: "lightcoral" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.length === 5} onChange={handleAllChange} />
              <span style={{ fontWeight: "bold" }}>All</span>
            </label>
          </div>
          <div className={styles.chbox} style={{ backgroundColor: "#2196F3" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.includes("work")} onChange={() => handleCategoryChange("work")} />
              <span style={{ fontWeight: "bold" }}>Work</span>
            </label>
          </div>
          <div className={styles.chbox} style={{ backgroundColor: "#08ccc2" }}>
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
          <div className={styles.chbox} style={{ backgroundColor: "#4CAF50" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.includes("todo")} onChange={() => handleCategoryChange("todo")} />
              <span style={{ fontWeight: "bold" }}>To do</span>
            </label>
          </div>
          <div className={styles.chbox} style={{ backgroundColor: "#9E9E9E" }}>
            <label>
              <input type="checkbox" checked={selectedCategories.includes("others")} onChange={() => handleCategoryChange("others")} />
              <span style={{ fontWeight: "bold" }}>Others</span>
            </label>
          </div>
        </div>

        <div className={styles.csv}>
          <button onClick={handleUploadClick} className={styles.uploadButton}>Upload</button>
          <button onClick={handleSaveClick} className={styles.uploadButton}>Save</button>
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
                <label>Description:</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className={styles.description}
                  placeholder="Enter event description"
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
                  <option value="school" style={{ background: "#08ccc2", color: "white" }}>School</option>
                  <option value="relax" style={{ background: "#FF9800", color: "white" }}>Relax</option>
                  <option value="todo" style={{ background: "#4CAF50", color: "white" }}>To do</option>
                  <option value="others" style={{ background: "#9E9E9E", color: "white" }}>Others</option>
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
              <p><label>Description:</label> {selectedEvent.resource?.description || "No description provided"}</p>
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
            <button onClick={() => deleteEvent(selectedEvent.id)} className={styles.closeButton} style={{ backgroundColor: "lightcoral" }}>Delete</button>
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
              <label>Description:</label>
              <textarea
                value={selectedEvent.description}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                className={styles.description}
                placeholder="Enter event description"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Start Date:</label>
              <input
                type="date"
                value={moment(selectedEvent.start).format("YYYY-MM-DD")}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, start: new Date(e.target.value) })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Start Time:</label>
              <input
                type="time"
                value={moment(selectedEvent.start).format("HH:mm")}
                onChange={(e) => setSelectedEvent({
                  ...selectedEvent,
                  start: new Date(moment(selectedEvent.start).format("YYYY-MM-DD") + "T" + e.target.value)
                })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>End Date:</label>
              <input
                type="date"
                value={moment(selectedEvent.end).format("YYYY-MM-DD")}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, end: new Date(e.target.value) })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>End Time:</label>
              <input
                type="time"
                value={moment(selectedEvent.end).format("HH:mm")}
                onChange={(e) => setSelectedEvent({
                  ...selectedEvent,
                  end: new Date(moment(selectedEvent.end).format("YYYY-MM-DD") + "T" + e.target.value)
                })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Type:</label>
              <select
                value={selectedEvent.category}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, category: e.target.value })}
              >
                <option value="work" style={{ background: "#2196F3", color: "white" }}>Work</option>
                <option value="school" style={{ background: "#08ccc2", color: "white" }}>School</option>
                <option value="relax" style={{ background: "#FF9800", color: "white" }}>Relax</option>
                <option value="todo" style={{ background: "#4CAF50", color: "white" }}>To do</option>
                <option value="others" style={{ background: "#9E9E9E", color: "white" }}>Others</option>
              </select>
            </div>
            <button onClick={saveEditedEvent} className={styles.closeButton} style={{ backgroundColor: "lightblue" }}>Save</button>
            <button onClick={() => setModalIsOpen(false)} className={styles.closeButton}>Close</button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={uploadModalIsOpen}
        onRequestClose={() => setUploadModalIsOpen(false)}
        ariaHideApp={false}
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
        style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          content: {
            width: '450px', // 👈 chỉ áp dụng cho content của modal này
            maxWidth: '90vw',
            margin: 'auto',
          }
        }}
      >
        <div>
          <h2 style={{ fontWeight: "bold", color: "#7b5410" }}>Upload File</h2>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={styles.dropZone}
          >
            <p>Drag and drop your csv file to upload</p>
          </div>
          <button onClick={() => fileInputRef.current.click()} className={styles.addButton}>Upload</button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <a
            href="/assets/template.csv"
            download="template.csv"
            className={styles.templateButton}
          >
            Template
          </a>

          <button onClick={() => setUploadModalIsOpen(false)} className={styles.closeButton}>Close</button>
        </div>
      </Modal>
    </div>
  );
}
