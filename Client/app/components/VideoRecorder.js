// /client/components/VideoRecorder.js

import React, { useState, useRef } from 'react';

function VideoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const downloadLinkRef = useRef(null);

  const startRecording = async () => {
    setRecordedChunks([]);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    // Update video element to show recording preview
    videoRef.current.srcObject = stream;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);

    // Set the video source for playback
    videoRef.current.srcObject = null;
    videoRef.current.src = videoUrl;

    // Enable the download link for users
    downloadLinkRef.current.href = videoUrl;
    downloadLinkRef.current.download = 'recording.webm';
    downloadLinkRef.current.style.display = 'block';
  };

  return (
    <div>
      <h1>Record Your Video</h1>
      <video ref={videoRef} controls autoPlay style={{ width: '100%', marginBottom: '20px' }}></video>
      <div>
        <button onClick={isRecording ? stopRecording : startRecording} className="bg-blue-500 text-white p-2 rounded">
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      <a ref={downloadLinkRef} style={{ display: 'none', marginTop: '20px' }} className="bg-green-500 text-white p-2 rounded">
        Download Video
      </a>
    </div>
  );
}

export default VideoRecorder;
