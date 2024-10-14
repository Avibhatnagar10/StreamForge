"use client";

import React, {  useRef, useState } from "react";

const Page = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [showPopup, setShowPopup] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [streamTitle, setStreamTitle] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [notification, setNotification] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },  
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsStreaming(true);

      
      

      setShowCountdown(true);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setShowCountdown(false);
            setNotification("Live stream started!");
            setTimeout(() => setNotification(""), 3000);
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing media devices.", error);
      setShowErrorPopup(true);
    }
  };

  const handleStartStream = () => {
    if (displayName && streamTitle) {
      startStream();
      setShowPopup(false);
    } else {
      alert("Please fill in all the fields.");
    }
  };

  const stopStreaming = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsStreaming(false);
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach((track) => track.stop());

      setNotification("Live stream ended!");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleDownload = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "recorded-video.mp4";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-black p-4">
      <h1 className="text-4xl font-bold mb-4">Live Stream</h1>
      {isStreaming && (
        <h2 className="text-2xl font-semibold mb-2 text-black">
          {streamTitle} - by {displayName}
        </h2>
      )}
      <div className="relative w-full max-w-5xl mb-4">
        <div className="theater-mode relative w-full h-0" style={{ paddingBottom: "56.25%" }}>
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg border-4 border-blue-500"
            autoPlay
            muted
          />
        </div>
      </div>
      <div className="flex justify-between w-full max-w-2xl mt-4">
        {isStreaming ? (
          <button
            onClick={stopStreaming}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            End Stream
          </button>
        ) : null}
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
          disabled={!recordedChunks.length}
        >
          Download Video
        </button>
      </div>

      {/* Popup for entering stream details */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Enter Stream Details</h2>
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Stream Title"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <button
              onClick={handleStartStream}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Live Stream
            </button>
          </div>
        </div>
      )}

      {/* Error popup for camera/mic issues */}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold text-red-600">Camera or Microphone not detected!  </h2>
            <p>Please check your device settings and reload the page.</p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Notification popup for stream start/end */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {/* Countdown popup */}
      {showCountdown && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white text-center p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-black">You're live in {countdown} secs!</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
