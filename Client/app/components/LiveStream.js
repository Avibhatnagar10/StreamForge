// /client/components/LiveStream.js

import React, { useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Your server URL

function LiveStream() {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const startStreaming = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = mediaStream;

    // Start streaming the media
    setStream(mediaStream);
    setIsStreaming(true);

    // Create MediaRecorder to record the stream
    const recorder = new MediaRecorder(mediaStream);
    setMediaRecorder(recorder);

    // Start recording when the stream starts
    recorder.start();
    
    // Save the recorded chunks
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => prev.concat(event.data));
      }
    };

    // Broadcast the stream to other peers
    socket.emit('signal', { to: 'otherPeerId', signal: mediaStream });
  };

  const stopStreaming = () => {
    stream.getTracks().forEach(track => track.stop());
    mediaRecorder.stop(); // Stop the recorder
    setIsStreaming(false);
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    URL.revokeObjectURL(url); // Clean up
  };

  useEffect(() => {
    socket.on('signal', (data) => {
      // Handle the incoming stream signal here
      // For example, if using a peer connection:
      // peerConnection.current.addStream(data.signal);
    });

    return () => {
      socket.off('signal');
    };
  }, []);

  return (
    <div>
      <h1>Live Stream</h1>
      <video ref={videoRef} autoPlay style={{ width: '100%', marginBottom: '20px' }}></video>
      <div>
        <button onClick={isStreaming ? stopStreaming : startStreaming} className="bg-blue-500 text-white p-2 rounded">
          {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
        </button>
        {isStreaming && (
          <button onClick={downloadRecording} className="bg-green-500 text-white p-2 rounded ml-4">
            Download Recording
          </button>
        )}
      </div>
    </div>
  );
}

export default LiveStream;
