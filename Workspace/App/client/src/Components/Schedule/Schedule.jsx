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
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { customToast } from "../../utils/customToast";
import "react-toastify/dist/ReactToastify.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function MyCalendar() {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), category: "work", description: "" });
  const [selectedCategories, setSelectedCategories] = useState(["work", "school", "relax", "todo", "other"]);
  const fileInputRef = useRef(null);
  const [uploadModalIsOpen, setUploadModalIsOpen] = useState(false);

  let axiosJWT = createAxios(user, dispatch, loginSuccess, navigate);

  const renderEvents = async () => {
    const data = await getEvents(user?.userData._id);
    const items = data.map(({ _id, userId, __v, start, end, ...rest }) => ({
      id: _id,
      title: rest.title,
      start: moment(start).toDate(),
      end: moment(end).toDate(),
      category: rest.category,
      ...rest,
      resource: { description: rest.description },
    }));
    setEvents(items);
  };

  useEffect(() => {
    renderEvents();
  }, []);

  const onEventDrop = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end, userId: user.userData._id };
    const access_token = user?.access_token;
    const response = await saveEvents(updatedEvent, event.id, access_token, axiosJWT);
    if (response.success) {
      setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
      // toast.success(`Sự kiện "${event.title}" đã được di chuyển!`);
      customToast(`Sự kiện "${event.title}" đã được di chuyển!`, "success", "bottom-right", 3000);
    } else {
      // toast.error("Lỗi: Không thể cập nhật sự kiện!");
      customToast("Lỗi: Không thể cập nhật sự kiện!", "error", "bottom-right", 3000);
    }
  };

  const onEventResize = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end, userId: user.userData._id };
    const access_token = user?.access_token;
    const response = await saveEvents(updatedEvent, event.id, access_token, axiosJWT);
    if (response.success) {
      setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
      // toast.success(`Sự kiện "${event.title}" đã được thay đổi kích thước!`);
      customToast(`Sự kiện "${event.title}" đã được thay đổi kích thước!`, "success", "bottom-right", 3000);
    } else {
      // toast.error("Lỗi: Không thể cập nhật sự kiện!");
      customToast("Lỗi: Không thể cập nhật sự kiện!", "error", "bottom-right", 3000);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: "", start, end, category: "work" });
    setModalType("add");
    setModalIsOpen(true);
  };

  const handleAllChange = (event) => {
    const checked = event.target.checked;
    setSelectedCategories(checked ? ["work", "school", "relax", "todo", "other"] : []);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      return newCategories.length === 5 ? ["work", "school", "relax", "todo", "other"] : newCategories;
    });
  };

  const filteredEvents = events.filter(event => selectedCategories.includes(event.category));
  const access_token = user?.access_token;

  const addEvent = async () => {
    if (newEvent.end < newEvent.start) {
      // toast.error("Lỗi: Thời gian kết thúc phải sau thời gian bắt đầu!");
      customToast("Lỗi: Thời gian kết thúc phải sau thời gian bắt đầu!", "error", "bottom-right", 3000);

      return;
    }
    const event = {
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      category: newEvent.category,
      description: newEvent.description
    }
    try {
      await addEvents(event, access_token, axiosJWT);
      setModalIsOpen(false);
      renderEvents();
      // toast.success(`Sự kiện "${event.title}" đã được thêm thành công!`);
      customToast(`Sự kiện "${event.title}" đã được thêm thành công!`, "success", "bottom-right", 3000);
    } catch (error) {
      // toast.error("Lỗi khi thêm sự kiện!");
      customToast("Lỗi khi thêm sự kiện!", "error", "bottom-right", 3000);
      setModalIsOpen(false);
    }
  };

  const saveEditedEvent = async () => {
    if (selectedEvent.end < selectedEvent.start) {
      // toast.error("Lỗi: Thời gian kết thúc phải sau thời gian bắt đầu!");
      customToast("Lỗi: Thời gian kết thúc phải sau thời gian bắt đầu!", "error", "bottom-right", 3000);
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

    const response = await saveEvents(event, selectedEvent.id, access_token, axiosJWT);
    if (response.success) {
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, ...event } : e));
      // toast.success(`Sự kiện "${event.title}" đã được sửa thành công!`);
      customToast(`Sự kiện "${event.title}" đã được sửa thành công!`, "success", "bottom-right", 3000);
    } else {
      // toast.error("Lỗi: Không thể cập nhật sự kiện!");
      customToast("Lỗi: Không thể cập nhật sự kiện!", "error", "bottom-right", 3000);
    }
    setModalIsOpen(false);
  };

  const deleteEvent = async (eventId) => {
    try {
      await deleteEvents(eventId, user?.userData._id, user?.access_token, axiosJWT);
      setEvents(events.filter(event => event.id !== eventId));
      setModalIsOpen(false);
      // toast.success("🗑️ Xóa sự kiện thành công!");
      customToast("🗑️ Xóa sự kiện thành công!", "success", "bottom-right", 3000);
    } catch (error) {
      // toast.error("Lỗi khi xóa sự kiện!");
      customToast("Lỗi khi xóa sự kiện!", "error", "bottom-right", 3000);
    }
  };


  const getEventStyle = (event) => {
    const colors = { school: "#08ccc2", work: "#2196F3", relax: "#FF9800", todo: "#4CAF50", other: "#9E9E9E" };
    return { style: { backgroundColor: colors[event.category], borderRadius: "8px", color: "white", padding: "5px" } };
  };

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalType, setModalType] = useState("add");

  const onSelectEvent = (event) => {
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
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (!file) {
      // toast.error("No file detected!");
      customToast("No file detected!", "error", "bottom-right", 3000);
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().replace(/^\uFEFF/, ""),
      complete: async (result) => {
        const currentEvents = await getEvents(user?.userData._id);

        const importedEvents = result.data.map(row => ({
          title: row.Title,
          start: moment(`${row["Start Day"]} ${row["Start Time"]}`, "YYYY-MM-DD HH:mm", true).toDate(),
          end: moment(`${row["End Day"]} ${row["End Time"]}`, "YYYY-MM-DD HH:mm", true).toDate(),
          category: row["Category"]?.toLowerCase(),
          description: row["Description"]?.trim() || "",
          userId: user?.userData._id,
        }));

        for (const event of importedEvents) {
          if (!event.title || isNaN(event.start) || isNaN(event.end)) continue;
          const isDuplicate = currentEvents.some(ev =>
            ev.title === event.title &&
            new Date(ev.start).getTime() === new Date(event.start).getTime() &&
            new Date(ev.end).getTime() === new Date(event.end).getTime()
          );
          if (!isDuplicate) {
            await addEvents(event, user?.access_token, axiosJWT);
          }
        }
        await renderEvents();
        // toast.success("Import thành công!");
        customToast("Import thành công!", "success", "bottom-right", 3000);
        setUploadModalIsOpen(false);
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
        const currentEvents = await getEvents(user?.userData._id);

        const importedEvents = result.data.map(row => ({
          title: row.Title,
          start: moment(`${row["Start Day"]} ${row["Start Time"]}`, "YYYY-MM-DD HH:mm").toDate(),
          end: moment(`${row["End Day"]} ${row["End Time"]}`, "YYYY-MM-DD HH:mm").toDate(),
          category: row.Category?.toLowerCase(),
          description: row.Description || "",
          userId: user?.userData._id,
        }));

        for (const event of importedEvents) {
          if (!event.title || isNaN(event.start) || isNaN(event.end)) continue;
          const isDuplicate = currentEvents.some(ev =>
            ev.title === event.title &&
            new Date(ev.start).getTime() === new Date(event.start).getTime() &&
            new Date(ev.end).getTime() === new Date(event.end).getTime()
          );
          if (!isDuplicate) {
            await addEvents(event, user?.access_token, axiosJWT);
          }
        }
        await renderEvents();
        // toast.success("Upload thành công!");
        customToast("Upload thành công!", "success", "bottom-right", 3000);
      },
    });
  };

  const handleSaveClick = async () => {
    const csvData = events.map(event => ({
      Title: event.title,
      "Start Day": moment(event.start).format("YYYY-MM-DD"),
      "Start Time": moment(event.start).format("HH:mm"),
      "End Day": moment(event.end).format("YYYY-MM-DD"),
      "End Time": moment(event.end).format("HH:mm"),
      Category: event.category,
      Description: event.description || ""
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "events.csv";
    link.click();
  };

  const syncWithGoogleCalendar = async () => {
    if (!user?.access_token) {
      // toast.error("Bạn chưa đăng nhập hoặc token không tồn tại.");
      customToast("Bạn chưa đăng nhập hoặc token không tồn tại.", "error", "bottom-right", 3000);
      return;
    }

    // Hiện toast loading
    // const loadingId = toast.loading("Đang đồng bộ với Google Calendar...");
    const loadingId = customToast("Đang đồng bộ với Google Calendar...", "loading", "bottom-right", 3000);

    try {
      const response = await axiosJWT.post('/api/google-calendar/sync', {}, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
        withCredentials: true,
        validateStatus: (status) => {
          return status === 200 || status === 403;
        }
      });

      const data = response.data;

      toast.dismiss(loadingId);

      if (response.status === 200) {
        const message = Array.isArray(data.message)
          ? data.message.filter(Boolean).join('\n')
          : data.message || "Đã đồng bộ Google Calendar thành công!";
        // toast.success(`✅ ${message}`);
        customToast(`✅ ${message}`, "success", "bottom-right", 3000);
        await renderEvents();
      } else {
        if (
          response.status === 403 ||
          data.message?.toLowerCase().includes("google calendar") ||
          data.message?.toLowerCase().includes("token")
        ) {
          // toast.info('🔗 Google Calendar chưa được kết nối. Đang chuyển hướng để kết nối...');
          customToast('🔗 Google Calendar chưa được kết nối. Đang chuyển hướng để kết nối...', "info", "bottom-right", 3000);
          const urlRes = await axios('/api/auth/connect-google', { withCredentials: true });
          const { url } = await urlRes.data;
          window.location.href = url;
        } else {
          // toast.error(`❌ Đồng bộ thất bại: ${data.message || "Unknown error"}`);
          customToast(`❌ Đồng bộ thất bại: ${data.message || "Unknown error"}`, "error", "bottom-right", 3000);
        }
      }
    } catch (error) {
      toast.dismiss(loadingId);
      // toast.error('❌ Lỗi khi đồng bộ Google Calendar');
      customToast('❌ Lỗi khi đồng bộ Google Calendar', "error", "bottom-right", 3000);
    }
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
              <input type="checkbox" checked={selectedCategories.includes("other")} onChange={() => handleCategoryChange("other")} />
              <span style={{ fontWeight: "bold" }}>Others</span>
            </label>
          </div>
        </div>

        <div className={styles.csv}>
          <button onClick={handleUploadClick} className={styles.uploadButton}>Upload</button>
          <button onClick={handleSaveClick} className={styles.uploadButton}>Save</button>
          <button onClick={syncWithGoogleCalendar} className={styles.uploadButton}>Sync</button>
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
        views={['month', 'week']}
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
                  <option value="other" style={{ background: "#9E9E9E", color: "white" }}>Others</option>
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
                <option value="other" style={{ background: "#9E9E9E", color: "white" }}>Others</option>
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
            width: '450px',
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
            <p>Drag and drop your csv file or click Upload button to upload</p>
          </div>
          <p style={{ fontSize: "12px", color: "red", fontStyle: "italic" }}>Notes: Do not edit csv with excel!</p>
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
      {/* <ToastContainer position="bottom-right" autoClose={3000} /> */}
    </div>
  );
}
