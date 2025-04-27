import { useState } from 'react';
import styles from './Record.module.css'; // Import CSS Module
import { useRecorder } from './record'; 
import fs from "fs";
import OpenAI from "openai";
// const openai = new OpenAI();
        
// const translation = async (audio) => {
//   return await openai.audio.translations.create({
//     file: fs.createReadStream(audio),
//     model: "whisper-1",
//   });
// };

// console.log(translation.text);

function RecordButton() {
    
    const { recording, audioFile, startRecording, stopRecording } = useRecorder();
  

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
        console.log("Đã tìm thấy file audio") && (
        <div>
          {/* <audio controls src={audioFile} /> */}
        </div>
      ))}
    </div>
    
  );
}

export default RecordButton;
