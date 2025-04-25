import React, { useState } from 'react';

const SpeechToText = () => {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'vi-VN';
  recognition.interimResults = false;

  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    setText(transcript);
  };

  recognition.onerror = event => {
    console.error('Loi:', event.error);
  };

  const startListening = () => {
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setListening(false);
    recognition.stop();
  };

  return (
    <div>
      <h2>Nhận diện giọng nói realtime</h2>
      <p><strong>Bạn vừa nói:</strong> {text}</p>
      <button onClick={startListening} disabled={listening}>Bắt đầu nói</button>
      <button onClick={stopListening} disabled={!listening}>Dừng</button>
    </div>
  );
};

export default SpeechToText;
