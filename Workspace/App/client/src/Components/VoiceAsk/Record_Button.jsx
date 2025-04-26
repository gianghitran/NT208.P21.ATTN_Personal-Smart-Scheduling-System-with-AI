import { useState } from 'react';
import styles from './Record.module.css'; // Import CSS Module
import { useRecorder } from './record'; 

function RecordButton() {
    
    const { recording, audioURL, startRecording, stopRecording } = useRecorder();
  

  return (
    <div className={styles.Container}>
      <div className={styles.RecordButton}>
        {recording ? (
          <button className={styles.StopButton} onClick={stopRecording} disabled={!recording}>
            
          </button>
        ) : (
          <button className={styles.StartButton} onClick={startRecording} disabled={recording}>
            
          </button>
        )}
      </div>
    </div>
  );
}

export default RecordButton;
