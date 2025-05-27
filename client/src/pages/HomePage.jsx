import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // adjust path as needed

export default function HomePage() {
  const [joinRoomId, setJoinRoomId] = useState('');
  const navigate = useNavigate();
  const db = getFirestore();
  const { currentUser } = useAuth(); // must return user { uid, email }

const handleCreateRoom = async () => {
  if (!currentUser) {
    alert('You must be logged in to create a room.');
    return;
  }

  const roomId = uuidv4();
  const roomRef = doc(db, 'rooms', roomId);

  try {
    await setDoc(roomRef, {
      createdBy: {
        uid: currentUser.uid,
        email: currentUser.email,
      },
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      isPrivate: true,
      participants: [
        {
          uid: currentUser.uid,
          email: currentUser.email,
        },
      ],
      [`joinedAt.${currentUser.uid}`]: serverTimestamp() // ✅ valid use
    });

    navigate(`/room/${roomId}`);
  } catch (error) {
    console.error('Error creating room:', error);
    alert('Failed to create room. Try again.');
  }
};


  const handleJoinRoom = () => {
    if (!joinRoomId.trim()) {
      alert('Please enter a room ID.');
      return;
    }

    navigate(`/room/${joinRoomId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8">📚 Virtual Study Room</h1>

      <button
        onClick={handleCreateRoom}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow mb-6 hover:bg-blue-700 transition"
      >
        ➕ Create Room
      </button>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
          className="border px-4 py-2 rounded w-64"
        />
        <button
          onClick={handleJoinRoom}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          🔗 Join Room
        </button>
      </div>
    </div>
  );
}