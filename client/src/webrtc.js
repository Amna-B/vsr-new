// webrtc.js
import { v4 as uuidv4 } from 'uuid';

let localConnection;
let remoteConnection;
let localStream;
let remoteStream;
let dataChannel;

// Create a new peer connection
// webrtc.js
export function initiatePeerConnection({ onIceCandidate, onTrack }) {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  });

  if (onIceCandidate) {
    peerConnection.onicecandidate = onIceCandidate;
  }

  if (onTrack) {
    peerConnection.ontrack = onTrack;
  }

  return peerConnection;
}

export async function handleOffer(peerConnection, offer) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
}

export async function handleAnswer(peerConnection, answer) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

export async function handleICECandidate(peerConnection, candidate) {
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (err) {
    console.error('Error adding received ICE candidate', err);
  }
}
