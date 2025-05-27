// /client/src/components/VideoCall.jsx
import React, { useEffect, useRef, useState } from 'react';

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
        alert('Failed to access camera/microphone.');
      }
    };

    getLocalStream();
  }, []);

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Video Call Room</h2>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="w-80 h-60 bg-black rounded-xl shadow-md"
      />
      <p className="mt-2 text-sm text-gray-600">You (Local Stream)</p>
    </div>
  );
};

export default VideoCall;
