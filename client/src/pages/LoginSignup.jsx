// src/pages/LoginSignup.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h2 className="text-2xl mb-4">{isRegistering ? 'Register' : 'Login'} to Study Room</h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <p
          className="text-sm text-blue-500 cursor-pointer underline"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Already have an account? Login' : 'New user? Register here'}
        </p>
      </form>
    </div>
  );
}























// export default function LoginSignup() {
//   const [isSignup, setIsSignup] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleAuth = async () => {
//     try {
//       if (isSignup) {
//         await createUserWithEmailAndPassword(auth, email, password);
//         alert("Signup successful!");
//       } else {
//         await signInWithEmailAndPassword(auth, email, password);
//         alert("Login successful!");
//       }
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
//       <h2 className="text-xl font-bold mb-4">{isSignup ? "Sign Up" : "Login"}</h2>
//       <input
//         className="w-full mb-2 p-2 border rounded"
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         className="w-full mb-4 p-2 border rounded"
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button
//         className="w-full bg-blue-600 text-white py-2 rounded"
//         onClick={handleAuth}
//       >
//         {isSignup ? "Sign Up" : "Login"}
//       </button>
//       <p className="mt-4 text-center text-sm">
//         {isSignup ? "Already have an account?" : "Don't have an account?"}
//         <button className="text-blue-600 ml-1" onClick={() => setIsSignup(!isSignup)}>
//           {isSignup ? "Login" : "Sign up"}
//         </button>
//       </p>
//     </div>
//   );
// }
