import React from 'react';
import { useRecorder } from './components/useRecorder';
import SpeechToText from './components/SpeechToText';

function App() {
  const { recording, audioURL, startRecording, stopRecording } = useRecorder();

  return (
    <div>
      <h1>App Ghi Âm và Nhận Diện Giọng Nói</h1>

      <h3>Ghi âm giọng nói</h3>
      <button onClick={startRecording} disabled={recording}>Bắt đầu ghi âm</button>
      <button onClick={stopRecording} disabled={!recording}>Dừng ghi âm</button>
      {audioURL && (
        <div>
          <h4>File ghi âm:</h4>
          <audio controls src={audioURL} />
        </div>
      )}

      <hr />

      <SpeechToText />
    </div>
  );
}

export default App;
