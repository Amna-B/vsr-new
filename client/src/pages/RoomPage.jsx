import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import {
  initiatePeerConnection,
  handleOffer,
  handleAnswer,
  handleICECandidate,
} from '../webrtc';

export default function RoomPage() {
  const { roomId } = useParams();
  const { currentUser } = useAuth();
  const db = getFirestore();

  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [peerConnections, setPeerConnections] = useState({});
  const localVideoRef = useRef();

  const isCreator = roomData?.createdBy?.uid === currentUser?.uid;

  const handleRemoveParticipant = useCallback(
    async (uidToRemove) => {
      if (!isCreator || !roomData) return;
      const roomRef = doc(db, 'rooms', roomId);
      const updatedParticipants = roomData.participants.filter((p) => p.uid !== uidToRemove);

      try {
        await updateDoc(roomRef, {
          participants: updatedParticipants,
          lastActive: serverTimestamp(),
          [`joinedAt.${currentUser.uid}`]: serverTimestamp(),
        });
      } catch (err) {
        console.error('Error removing participant:', err);
        alert('Failed to remove participant.');
      }
    },
    [isCreator, roomData, db, roomId, currentUser]
  );

  const handleDeleteRoom = async () => {
    if (!isCreator) return;
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await deleteDoc(doc(db, 'rooms', roomId));
      alert('Room deleted!');
      window.location.href = '/';
    } catch (err) {
      console.error('Error deleting room:', err);
      alert('Failed to delete room.');
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const roomRef = doc(db, 'rooms', roomId);
    const unsubscribe = onSnapshot(roomRef, async (docSnap) => {
      if (!docSnap.exists()) {
        alert('Room not found!');
        return;
      }

      const data = docSnap.data();
      const participants = data.participants || [];

      const alreadyJoined = participants.some((p) => p.uid === currentUser.uid);
      if (!alreadyJoined) {
        const updated = [...participants, { uid: currentUser.uid, email: currentUser.email }];
        await updateDoc(roomRef, {
          participants: updated,
          [`joinedAt.${currentUser.uid}`]: serverTimestamp(),
        });
      }

      setRoomData({ ...data });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId, currentUser, db]);

  useEffect(() => {
    async function getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Failed to get media:', err);
      }
    }

    getMedia();
  }, []);

  useEffect(() => {
    if (!localStream || !roomData) return;

    roomData.participants?.forEach(async (participant) => {
      if (participant.uid === currentUser.uid || peerConnections[participant.uid]) return;

      const pc = initiatePeerConnection({
        onIceCandidate: async (event) => {
          if (event.candidate) {
            const signalRef = collection(db, 'rooms', roomId, 'signals');
            await addDoc(signalRef, {
              type: 'ice-candidate',
              from: currentUser.uid,
              to: participant.uid,
              candidate: event.candidate.toJSON(),
              timestamp: serverTimestamp(),
            });
          }
        },
        onTrack: (event) => {
          const remoteVideo = document.getElementById(`video-${participant.uid}`);
          if (remoteVideo && !remoteVideo.srcObject) {
            remoteVideo.srcObject = event.streams[0];
          }
        },
      });

      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      setPeerConnections((prev) => ({ ...prev, [participant.uid]: pc }));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const signalRef = collection(db, 'rooms', roomId, 'signals');
      await addDoc(signalRef, {
        type: 'offer',
        from: currentUser.uid,
        to: participant.uid,
        sdp: offer,
        timestamp: serverTimestamp(),
      });
    });
  }, [localStream, roomData, peerConnections, db, roomId, currentUser]);

  useEffect(() => {
    if (!roomData || !currentUser) return;

    const signalRef = collection(db, 'rooms', roomId, 'signals');
    const q = query(signalRef, where('to', '==', currentUser.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const signalDoc = change.doc;
        const data = signalDoc.data();
        const fromUid = data.from;

        try {
          if (data.type === 'offer') {
            const pc = initiatePeerConnection({
              onIceCandidate: async (event) => {
                if (event.candidate) {
                  await addDoc(signalRef, {
                    type: 'ice-candidate',
                    from: currentUser.uid,
                    to: fromUid,
                    candidate: event.candidate.toJSON(),
                    timestamp: serverTimestamp(),
                  });
                }
              },
              onTrack: (event) => {
                const remoteVideo = document.getElementById(`video-${fromUid}`);
                if (remoteVideo && !remoteVideo.srcObject) {
                  remoteVideo.srcObject = event.streams[0];
                }
              },
            });

            localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
            setPeerConnections((prev) => ({ ...prev, [fromUid]: pc }));

            await handleOffer(pc, data.sdp);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            await addDoc(signalRef, {
              type: 'answer',
              from: currentUser.uid,
              to: fromUid,
              sdp: answer,
              timestamp: serverTimestamp(),
            });
          } else if (data.type === 'answer') {
            const pc = peerConnections[fromUid];
            if (pc) await handleAnswer(pc, data.sdp);
          } else if (data.type === 'ice-candidate') {
            const pc = peerConnections[fromUid];
            if (pc) await handleICECandidate(pc, new RTCIceCandidate(data.candidate));
          }

          await deleteDoc(signalDoc.ref);
        } catch (err) {
          console.error('Error handling signal:', err);
        }
      });
    });

    return () => unsubscribe();
  }, [roomData, currentUser, localStream, peerConnections, db, roomId]);

  if (!currentUser) return <p className="p-6">Please log in to access this room.</p>;
  if (loading) return <p className="p-6">Loading room...</p>;
  if (!roomData) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📘 Room ID: {roomId}</h1>

      <div className="mb-6">
        <p className="text-lg font-medium">🔗 Invite Link:</p>
        <div className="flex items-center gap-2 mt-2">
          <input
            value={`${window.location.origin}/join/${roomId}`}
            readOnly
            className="border px-3 py-2 rounded w-full"
            onClick={(e) => e.currentTarget.select()}
          />
          <button
            className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-900 transition"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/join/${roomId}`);
              alert('Link copied to clipboard!');
            }}
          >
            📋 Copy
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">👥 Participants:</h2>
        <ul className="list-disc pl-6">
          {(roomData.participants || []).map((p, i) => (
            <li key={i} className="flex flex-col mb-4">
              <div className="flex justify-between items-center">
                <span>{p.email}</span>
                {isCreator && p.uid !== currentUser.uid && (
                  <button
                    className="text-sm text-red-600 hover:underline ml-2"
                    onClick={() => handleRemoveParticipant(p.uid)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <video
                id={`video-${p.uid}`}
                className="w-64 h-48 border mt-2"
                autoPlay
                playsInline
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">🧑 Your Stream</h2>
        <video ref={localVideoRef} className="w-64 h-48 border" autoPlay muted playsInline />
      </div>

      {isCreator && (
        <div className="mt-8">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={handleDeleteRoom}
          >
            🗑️ Delete Room
          </button>
        </div>
      )}
    </div>
  );
}







// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   getFirestore,
//   doc,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
//   serverTimestamp,
// } from 'firebase/firestore';
// import { useAuth } from '../context/AuthContext';


// // Import WebRTC setup
// import { initiatePeerConnection, handleOffer, handleAnswer, handleICECandidate } from '../webrtc';


// export default function RoomPage() {
//   const { roomId } = useParams();
//   const { currentUser } = useAuth();
//   const db = getFirestore();

//   const [roomData, setRoomData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [localStream, setLocalStream] = useState(null); // For user's video
//   const [peerConnections, setPeerConnections] = useState({}); // To manage peer connections


//   const isCreator = roomData?.createdBy?.uid === currentUser?.uid;

//   // 🧠 Remove Participant (Creator Only)
//   const handleRemoveParticipant = useCallback(
//     async (uidToRemove) => {
//       if (!isCreator || !roomData) return;

//       const roomRef = doc(db, 'rooms', roomId);
//       const updatedParticipants = roomData.participants.filter(
//         (p) => p.uid !== uidToRemove
//       );

//       try {
//         await updateDoc(roomRef, {
//           participants: updatedParticipants,
//           lastActive: serverTimestamp(),
//           [`joinedAt.${currentUser.uid}`]: serverTimestamp(),
//         });
//         console.log(`Removed ${uidToRemove}`);
//       } catch (err) {
//         console.error('Error removing participant:', err);
//         alert('Failed to remove participant.');
//       }
//     },
//     [isCreator, roomData, db, roomId]
//   );

//   // 🧨 Delete Room (Creator Only)
//   const handleDeleteRoom = async () => {
//     if (!isCreator) return;
//     const confirmDelete = window.confirm('Are you sure you want to delete this room?');
//     if (!confirmDelete) return;

//     try {
//       await deleteDoc(doc(db, 'rooms', roomId));
//       alert('Room deleted!');
//       window.location.href = '/';
//     } catch (err) {
//       console.error('Error deleting room:', err);
//       alert('Failed to delete room.');
//     }
//   };

//   // 🔄 Real-time room listener
//   useEffect(() => {
//     if (!currentUser) return;

//     const roomRef = doc(db, 'rooms', roomId);

//     const unsubscribe = onSnapshot(roomRef, async (docSnap) => {
//       if (!docSnap.exists()) {
//         alert('Room not found!');
//         return;
//       }

//       const data = docSnap.data();
//       const participants = data.participants || [];

//       // Join if not already in the participant list
//       const alreadyJoined = participants.some((p) => p.uid === currentUser.uid);
//       if (!alreadyJoined) {
//         const updated = [
//           ...participants,
//           { uid: currentUser.uid, email: currentUser.email },
//         ];
//         await updateDoc(roomRef, {
//           participants: updated,
//           [`joinedAt.${currentUser.uid}`]: serverTimestamp(), // ✅ safe timestamp usage
//         });
//       }

//       setRoomData({ ...data }); // Spread to ensure state update
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [roomId, currentUser, db]);

//   // 🕐 Loading and Access Guards
//   if (!currentUser) return <p className="p-6">Please log in to access this room.</p>;
//   if (loading) return <p className="p-6">Loading room...</p>;
//   if (!roomData) return null;

//   return (
//     <div className="p-8 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">📘 Room ID: {roomId}</h1>

//       {/* 🔗 Invite Link */}
//       <div className="mb-6">
//         <p className="text-lg font-medium">🔗 Invite Link:</p>
//         <div className="flex items-center gap-2 mt-2">
//           <input
//             value={`${window.location.origin}/join/${roomId}`}
//             readOnly
//             className="border px-3 py-2 rounded w-full"
//             onClick={(e) => e.currentTarget.select()}
//           />
//           <button
//             className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-900 transition"
//             onClick={() => {
//               navigator.clipboard.writeText(`${window.location.origin}/join/${roomId}`);
//               alert('Link copied to clipboard!');
//             }}
//           >
//             📋 Copy
//           </button>
//         </div>
//       </div>

//       {/* 👥 Participants */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-semibold mb-2">👥 Participants:</h2>
//         <ul className="list-disc pl-6">
//           {(roomData.participants || []).map((p, i) => (
//             <li key={i} className="flex justify-between items-center">
//               <span>{p.email}</span>
//               {isCreator && p.uid !== currentUser.uid && (
//                 <button
//                   className="text-sm text-red-600 hover:underline ml-2"
//                   onClick={() => handleRemoveParticipant(p.uid)}
//                 >
//                   Remove
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* 🗑️ Delete Room Button (Visible to Creator) */}
//       {isCreator && (
//         <div className="mt-8">
//           <button
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
//             onClick={handleDeleteRoom}
//           >
//             🗑️ Delete Room
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


















// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
// import { useAuth } from '../context/AuthContext';
// import { serverTimestamp } from 'firebase/firestore';

// export default function RoomPage() {
//   const { roomId } = useParams();
//   const { currentUser } = useAuth();
//   const db = getFirestore();

//   const [roomData, setRoomData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const isCreator = roomData?.createdBy?.uid === currentUser.uid;


//   useEffect(() => {
//     const handleRemoveParticipant = async (uidToRemove) => {
//       if (!isCreator) return;

//       const roomRef = doc(db, 'rooms', roomId);
//       const updatedParticipants = roomData.participants.filter(p => p.uid !== uidToRemove);

//       try {
//         await updateDoc(roomRef, {
//           participants: updatedParticipants,
//         });

//         console.log(`Removed ${uidToRemove}`);
//       } catch (err) {
//         console.error('Error removing participant:', err);
//         alert('Failed to remove participant.');
//       }
//     };
//     const handleDeleteRoom = async () => {
//   const confirmDelete = window.confirm('Are you sure you want to delete this room?');
//   if (!confirmDelete) return;

//   try {
//     await deleteDoc(doc(db, 'rooms', roomId));
//     alert('Room deleted!');
//     window.location.href = '/';
//   } catch (err) {
//     console.error('Error deleting room:', err);
//     alert('Failed to delete room.');
//   }
// };



//     if (!currentUser) return;

//     const roomRef = doc(db, 'rooms', roomId);

//     const unsubscribe = onSnapshot(roomRef, async (docSnap) => {
//       if (!docSnap.exists()) {
//         alert('Room not found!');
//         return;
//       }

//       const data = docSnap.data();

//       // Check if user is already a participant
//       const participants = data.participants || [];
//       const alreadyJoined = participants.some(p => p.uid === currentUser.uid);

//       if (!alreadyJoined) {
//         const updated = [...participants, { uid: currentUser.uid, email: currentUser.email }];
//         await updateDoc(roomRef, {
//           participants: updated,
//           [`joinedAt.${currentUser.uid}`]: serverTimestamp(),
//         });
//       }

//       setRoomData(data);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [roomId, currentUser]);

//   if (!currentUser) return <p className="p-6">Please log in to access this room.</p>;
//   if (loading) return <p className="p-6">Loading room...</p>;
//   if (!roomData) return null;

//   return (
    
//     <div className="p-8 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">📘 Room ID: {roomId}</h1>

//       {/* Invite Link */}
//       <div className="mb-6">
//         <p className="text-lg font-medium">🔗 Invite Link:</p>
//         <div className="flex items-center gap-2 mt-2">
//           <input
//             value={`${window.location.origin}/join/${roomId}`}
//             readOnly
//             className="border px-3 py-2 rounded w-full"
//             onClick={(e) => e.currentTarget.select()}
//           />
//           <button
//             className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-900 transition"
//             onClick={() => {
//               navigator.clipboard.writeText(`${window.location.origin}/join/${roomId}`);
//               alert('Link copied to clipboard!');
//             }}
//           >
//             📋 Copy
//           </button>
//         </div>
//       </div>

//       {/* Participants */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-2">👥 Participants:</h2>
//         <ul className="list-disc pl-6">
//           {(roomData.participants || []).map((p, i) => (
//             <li key={i} className="flex justify-between items-center">
//               <span>{p.email}</span>
//               {isCreator && p.uid !== currentUser.uid && (
//                 <button
//                   className="text-sm text-red-600 hover:underline ml-2"
//                   onClick={() => handleRemoveParticipant(p.uid)}
//                 >
//                   Remove
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

















// // src/pages/RoomPage.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
// import { auth } from '../firebase';
// import { db } from '../firebase';


// import {
//   collection,
//   onSnapshot,
// } from 'firebase/firestore';

// export default function RoomPage() {
//   const { roomId } = useParams();
//   const [participants, setParticipants] = useState([]);

//   useEffect(() => {
//     const joinRoom = async () => {
//       const user = auth.currentUser;

//       if (!user) {
//         console.error("User not logged in");
//         return;
//       }

//       const roomRef = doc(db, 'rooms', roomId);
//       const roomSnap = await getDoc(roomRef);

//       if (!roomSnap.exists()) {
//         await setDoc(roomRef, {
//           roomId,
//           createdAt: serverTimestamp(),
//           active: true,
//         });
//       }

//       // Add user to participants subcollection
//       const participantRef = doc(db, 'rooms', roomId, 'participants', user.uid);
//       await setDoc(participantRef, {
//         email: user.email,
//         joinedAt: serverTimestamp(),
//       });

//       // Live listener for participants
//       const unsub = onSnapshot(
//         collection(db, 'rooms', roomId, 'participants'),
//         (snapshot) => {
//           const list = snapshot.docs.map(doc => doc.data());
//           setParticipants(list);
//         }
//       );

//       return () => unsub();
//     };

//     joinRoom();
//   }, [roomId]);

//   return (
//     <div className="min-h-screen p-6 bg-white text-black">
//       <h2 className="text-2xl mb-4">📚 Room ID: <span className="font-mono">{roomId}</span></h2>

//       <div className="mb-4">
//         <h3 className="text-lg font-semibold mb-2">👥 Participants:</h3>
//         <ul className="list-disc pl-6">
//           {participants.map((p, idx) => (
//             <li key={idx}>{p.email}</li>
//           ))}
//         </ul>
//       </div>
//       <p>Share this link to invite others:</p>
//       <input
//         value={`${window.location.origin}/join/${roomId}`}
//         readOnly
//         onClick={(e) => e.currentTarget.select()}
//       />
//     </div>
//   );
// }























// export default function RoomPage() {
//   const { roomId } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkOrCreateRoom = async () => {
//       const roomRef = doc(db, "rooms", roomId);
//       const roomSnap = await getDoc(roomRef);

//       if (!roomSnap.exists()) {
//         // Room doesn't exist — create one
//         await setDoc(roomRef, {
//           roomId,
//           createdAt: serverTimestamp(),
//           active: true,
//         });
//         console.log("Room created:", roomId);
//       } else {
//         console.log("Room exists:", roomId);
//       }
//     };

//     checkOrCreateRoom();
//   }, [roomId]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white text-black">
//       <h2 className="text-3xl">📹 You are in Room: <span className="font-mono">{roomId}</span></h2>
//     </div>
//   );
// }
