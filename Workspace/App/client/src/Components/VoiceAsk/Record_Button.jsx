import { useState, useEffect } from 'react';
import styles from './Record.module.css'; // Import CSS Module
import { useRecorder } from './record'; 
import { useSelector } from "react-redux";



const RecordButton=({onTransfer, onTransfering }) =>{
    const user = useSelector((state) => state.auth.login?.currentUser);
    const userId = user?.userData._id; 
    const [textTransfer, settextTransfer] = useState(null);
    
    const { recording, audioFile, startRecording, stopRecording } = useRecorder();
    
    const fetchResponse = async () => {
      try {
        if (!audioFile) {
          return res.status(400).json({ error: "Không tìm thấy file audio" });
        }
        if (onTransfering) onTransfering(true);
        const formData = new FormData();
        formData.append("file", audioFile, "audio.wav");
        const resTextfromAPI = await fetch(`http://localhost:4000/api/speech/send/${userId}`, {
          method: "POST",
          body: formData,
        });
        const data = await resTextfromAPI.json();
        console.log("Nhận data từ API, type:", data);
        settextTransfer(data);
        console.log("Transfering..");
        if (onTransfer && data?.text) {
          onTransfer(data.text);// guwri duwx lieeuj ra ngoài component
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally {
        if (onTransfering) onTransfering(false); // Kết thúc transferring
      }
    };
    
    useEffect(() => {
      if (audioFile) {
        console.log("Đã tìm thấy file audio, fetching data...");
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
      {audioFile &&   (
        <div>
          
          {/* <audio controls src={audioFile} /> */}
        </div>
      )}
    </div>
    
  );
}

export default RecordButton;
