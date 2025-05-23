import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

let eventSource = null;
let isInitialized = false;
const listeners = {};

const handleEventUpdate = (data) => {
    const startOfWeek = moment(data.start).startOf('isoWeek').toDate();
    const endOfWeek = moment(data.end).endOf('isoWeek').toDate();
    listeners.EVENT_UPDATED?.(startOfWeek, endOfWeek, true, false, "week");
}

const handleEventDelete = (data) => {
  const startOfWeek = moment(data.start).startOf('isoWeek').toDate();
  const endOfWeek = moment(data.end).endOf('isoWeek').toDate();
  listeners.EVENT_DELETED?.(startOfWeek, endOfWeek, true, true, "week", data.data.eventId);
};

const handleNotification = (data) => {
    listeners.NOTIFICATION();
}

const handlers = {
  EVENT_UPDATED: (data) => {
    // gọi hàm riêng xử lý update
    handleEventUpdate(data);
  },
  EVENT_DELETED: (data) => {
    handleEventDelete(data);
  },
  NOTIFICATION: (data) => {
    handleNotification(data);
  },
};

export const addSSEListener = (type, callback) => {
  listeners[type] = callback;
};

export const initSSE = (userId) => {
  if (!userId || isInitialized) return;

  let clientId = localStorage.getItem("sseClientId");
  if (!clientId) {
    clientId = uuidv4();
    localStorage.setItem("sseClientId", clientId);
  }

  eventSource = new EventSource(`/api/sse/stream/${userId}?clientId=${clientId}`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const type = data?.type;
      if (type && handlers[type]) {
        handlers[type](data);
      }
    } catch (err) {
      console.error("SSE parse error:", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE error:", err);
    eventSource.close();
    isInitialized = false;
  };

  isInitialized = true;
};

export const removeSSEListener = (type, callback) => {
  if (!listeners[type]) return;
  delete listeners[type];
};

export const closeSSE = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    isInitialized = false;
  }
};