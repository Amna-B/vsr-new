import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function JoinRoomHandler() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Add verification if needed
    navigate(`/room/${roomId}`);
  }, [roomId, navigate]);

  return <p className="p-4">Redirecting to room...</p>;
}
