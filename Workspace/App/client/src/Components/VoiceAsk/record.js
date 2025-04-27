import { useState, useRef } from 'react';
import { setRecord } from '../../redux/recordSlide'; // Import your addRecord function

export const useRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      try{
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioFile(blob);

        // Lưu vào sessionStorage
        const reader = new FileReader();
        reader.onload = () => {
          sessionStorage.setItem('audioFile', reader.result);
        };
        reader.readAsDataURL(blob);

        //luuw vào session storage
        setRecord(blob);
        console.log("Lưu audio thành công:", blob);
      }catch (error) {
        console.error("Lỗi lưu audio:", error);
    };    
    };

      mediaRecorderRef.current.start();
      setRecording(true);
    };
  


  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return { recording, audioFile, startRecording, stopRecording };
};
