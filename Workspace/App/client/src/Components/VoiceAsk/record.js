import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setRecord } from '../../redux/recordSlide';

export const useRecorder = () => {
  const dispatch = useDispatch();

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
      try {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioFile(blob);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;

          sessionStorage.setItem('audioFile', base64String);
          dispatch(setRecord(base64String));

          console.log("Lưu audio thành công:", base64String);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Lỗi lưu audio:", error);
      }
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
