import { useState, useEffect } from 'react';
import styles from './Record.module.css'; // Import CSS Module
import { useRecorder } from './record'; 
import { useSelector } from "react-redux";



const RecordButton=() =>{
    const user = useSelector((state) => state.auth.login?.currentUser);
    const userId = user?.userData._id; 

    
    const { recording, audioFile, startRecording, stopRecording } = useRecorder();
    
    const fetchResponse = async () => {
      try {
        if (!audioFile) {
          return res.status(400).json({ error: "Không tìm thấy file audio" });
        }
        const resTextfromAPI = await fetch(`http://localhost:4000/api/speech/send/${userId}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: audioFile }),
        });
        const data = await resTextfromAPI.json();
        console.log("Data từ API:", data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    useEffect(() => {
      if (audioFile) {
        console.log("Audio file found, fetching data...");
        fetchResponse(audioFile);
      }
    }, [audioFile]);
    

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
      {audioFile && (
        console.log("Đã tìm thấy file audio") &&  (
        <div>
          
          {/* <audio controls src={audioFile} /> */}
        </div>
      ))}
    </div>
    
  );
}

export default RecordButton;
