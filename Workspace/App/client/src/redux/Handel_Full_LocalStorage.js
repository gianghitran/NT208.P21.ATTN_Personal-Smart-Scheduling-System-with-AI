// customStorage.js
import storage from 'redux-persist/lib/storage';

const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // Giới hạn dung lượng lưu trữ là 5MB

// Kiểm tra dung lượng hiện tại của localStorage
const checkStorageSize = () => {
  let totalSize = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length;
    }
  }
  return totalSize;
};

// Xóa dữ liệu cũ nhất nếu storage đầy
const clearOldestItem = () => {
  const keys = Object.keys(localStorage);
  if (keys.length === 0) return;

  // Lấy các mục và sắp xếp chúng theo timestamp (mốc thời gian)
  const sortedKeys = keys
    .map((key) => ({ key, timestamp: localStorage.getItem(key + ':timestamp') }))
    .sort((a, b) => a.timestamp - b.timestamp);

  // Xóa mục cũ nhất
  const oldestKey = sortedKeys[0].key;
  localStorage.removeItem(oldestKey);
  localStorage.removeItem(oldestKey + ':timestamp'); // Xóa timestamp đi kèm
};

const customStorage = {
  ...storage,
  setItem: (key, value) => {
    // Kiểm tra dung lượng trước khi lưu trữ
    if (checkStorageSize() + value.length > MAX_STORAGE_SIZE) {
      console.warn('Storage is full. Clearing oldest item...');
      clearOldestItem(); // Xóa mục cũ nhất
    }
    
    // Lưu giá trị vào localStorage và thêm timestamp
    const timestamp = new Date().getTime();
    localStorage.setItem(key, value);
    localStorage.setItem(key + ':timestamp', timestamp.toString()); // Lưu thời gian lưu trữ
    return Promise.resolve();
  },
};

export default customStorage;
