// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyCmprgDPiATAPNz2VTrJ49Zx9IBXy84p1o",
  authDomain: "virtualstudyroom-8a8fa.firebaseapp.com",
  projectId: "virtualstudyroom-8a8fa",
  storageBucket: "virtualstudyroom-8a8fa.firebasestorage.app",
  messagingSenderId: "924073573513",
  appId: "1:924073573513:web:68d38cb4b1640106f19a58",
  measurementId: "G-5Q7FNC6PGT"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);  // Firestore instance
