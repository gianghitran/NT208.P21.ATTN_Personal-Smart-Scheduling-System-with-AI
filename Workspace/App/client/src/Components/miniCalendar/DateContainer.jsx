import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Calendar.module.css'; // Import CSS Module

function DateContainer() {
  const [value, onChange] = useState(new Date());

  return (
    <div className={styles.calendarContainer}>
      <Calendar  className="title_calendar"
        onChange={onChange} 
        value={value} 
        tileClassName={({ date, view }) => 
          view === "month" && date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()
            ? (styles.activeDay)
            : styles.tile
        } 
      />
    </div>
  );
}

export default DateContainer;
