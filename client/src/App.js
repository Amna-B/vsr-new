import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/sidebar";
import FloatingPomodoro from './components/FloatingPomodoro';
import Dashboard from "./pages/Dashboard";
import Pomodoro from "./pages/Pomodoro";
import Syllabus from "./pages/Syllabus";
import Assistant from "./pages/Assistant";
import LoginSignup from "./pages/LoginSignup";
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';
import JoinRoomHandler from './pages/JoinRoomHandler';
import VideoCall from './components/VideoCall';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ correct import path

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen overflow-hidden">
          {sidebarOpen && <Sidebar />}
          <div className="flex flex-col flex-1">
             <Navbar toggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-y-auto p-6 bg-white shadow-inner">
              <Routes>
                {/* 🔓 Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<LoginSignup />} />
                <Route path="/room/:roomId" element={<RoomPage />} />
                <Route path="/join/:roomId" element={<JoinRoomHandler />} />
                <Route path="/video-call" element={<VideoCall />} />

                {/* 🔒 Protected Routes */}
                <Route
                  path="/pomodoro"
                  element={
                    <ProtectedRoute>
                      <Pomodoro />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/syllabus"
                  element={
                    <ProtectedRoute>
                      <Syllabus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assistant"
                  element={
                    <ProtectedRoute>
                      <Assistant />
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  }
                /> */}

                {/* Optional future protected route */}
                {/* <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                /> */}
              </Routes>
              <FloatingPomodoro />
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;





















// // // // import logo from './logo.svg';
// // // // import './App.css';

// // // // function App() {
// // // //   return (
// // // //     <div className="App">
// // // //       <header className="App-header">
// // // //         <img src={logo} className="App-logo" alt="logo" />
// // // //         <p>
// // // //           Edit <code>src/App.js</code> and save to reload.
// // // //         </p>
// // // //         <a
// // // //           className="App-link"
// // // //           href="https://reactjs.org"
// // // //           target="_blank"
// // // //           rel="noopener noreferrer"
// // // //         >
// // // //           Learn React
// // // //         </a>
// // // //       </header>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default App;

// // // import React, { useState, useEffect } from "react";
// // // import io from "socket.io-client";
// // // import axios from "axios";

// // // const socket = io("http://localhost:5000");

// // // function App() {
// // //   const [room, setRoom] = useState("");
// // //   const [joined, setJoined] = useState(false);
// // //   const [message, setMessage] = useState("");
// // //   const [chat, setChat] = useState([]);
// // //   const [aiPrompt, setAiPrompt] = useState("");
// // //   const [aiReply, setAiReply] = useState("");

// // //   useEffect(() => {
// // //     socket.on("chat-message", (msg) => {
// // //       setChat((prev) => [...prev, msg]);
// // //     });
// // //   }, []);

// // //   const joinRoom = () => {
// // //     socket.emit("join-room", room);
// // //     setJoined(true);
// // //   };

// // //   const sendMessage = () => {
// // //     socket.emit("chat-message", { roomId: room, message });
// // //     setChat((prev) => [...prev, message]);
// // //     setMessage("");
// // //   };

// // //   const askAI = async () => {
// // //     const res = await axios.post("http://localhost:5000/api/ai/ask", {
// // //       prompt: aiPrompt,
// // //     });
// // //     setAiReply(res.data.reply);
// // //   };

// // //   return (
// // //     <div style={{ padding: "20px" }}>
// // //       {!joined ? (
// // //         <div>
// // //           <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room ID" />
// // //           <button onClick={joinRoom}>Join Room</button>
// // //         </div>
// // //       ) : (
// // //         <div>
// // //           <h2>Room: {room}</h2>
// // //           <div>
// // //             <input
// // //               value={message}
// // //               onChange={(e) => setMessage(e.target.value)}
// // //               placeholder="Type message"
// // //             />
// // //             <button onClick={sendMessage}>Send</button>
// // //           </div>
// // //           <div style={{ marginTop: "10px" }}>
// // //             <h3>Chat:</h3>
// // //             {chat.map((msg, i) => (
// // //               <div key={i}>{msg}</div>
// // //             ))}
// // //           </div>
// // //           <hr />
// // //           <div>
// // //             <h3>AI Assistant</h3>
// // //             <input
// // //               value={aiPrompt}
// // //               onChange={(e) => setAiPrompt(e.target.value)}
// // //               placeholder="Ask something..."
// // //             />
// // //             <button onClick={askAI}>Ask</button>
// // //             <p><b>Reply:</b> {aiReply}</p>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default App;
// // import React, { useState, useEffect } from "react";
// // import io from "socket.io-client";
// // import axios from "axios";

// // const socket = io("http://localhost:5000");
// // const [summary, setSummary] = useState("");
// // const [questions, setQuestions] = useState("");


// // function App() {
// //   const [room, setRoom] = useState("");
// //   const [joined, setJoined] = useState(false);
// //   const [message, setMessage] = useState("");
// //   const [chat, setChat] = useState([]);
// //   const [aiPrompt, setAiPrompt] = useState("");
// //   const [aiReply, setAiReply] = useState("");
// //   const [timeLeft, setTimeLeft] = useState(null);
// //   const [showExtend, setShowExtend] = useState(false);
// //   const [uploadedFile, setUploadedFile] = useState(null);

// //   useEffect(() => {
// //     socket.on("chat-message", (msg) => setChat((prev) => [...prev, msg]));
// //     socket.on("timer-update", (seconds) => {
// //       setTimeLeft(seconds);
// //       if (seconds === 0) setShowExtend(true);
// //     });
// //     socket.on("timer-ended", () => setShowExtend(true));
// //   }, []);

// //   const joinRoom = () => {
// //     socket.emit("join-room", room);
// //     setJoined(true);
// //   };

// //   const sendMessage = () => {
// //     socket.emit("chat-message", { roomId: room, message });
// //     setChat((prev) => [...prev, message]);
// //     setMessage("");
// //   };

// //   const askAI = async () => {
// //     const res = await axios.post("http://localhost:5000/api/ai/ask", {
// //       prompt: aiPrompt,
// //     });
// //     setAiReply(res.data.reply);
// //   };

// //   const startPomodoro = () => {
// //     socket.emit("start-timer", { roomId: room, duration: 25 * 60 });
// //     setShowExtend(false);
// //   };

// //   const stopPomodoro = () => {
// //     socket.emit("stop-timer", room);
// //     setShowExtend(false);
// //   };

// //   const extendTime = () => {
// //     socket.emit("extend-timer", { roomId: room, extra: 5 * 60 });
// //     setShowExtend(false);
// //   };

// //   const uploadNote = async () => {
// //     const formData = new FormData();
// //     formData.append("note", uploadedFile);

// //     const res = await axios.post("http://localhost:5000/api/upload", formData, {
// //       headers: { "Content-Type": "multipart/form-data" },
// //     });
// //     alert("Uploaded: " + res.data.filename);
// //   };

// //   const summarizeNote = async () => {
// //     const res = await axios.post("http://localhost:5000/api/summarize", {
// //       filename: uploadedFile.name,
// //     });
// //     setSummary(res.data.summary);
// //   };
  
// //   const generateQuestions = async () => {
// //     const res = await axios.post("http://localhost:5000/api/questions", {
// //       filename: uploadedFile.name,
// //     });
// //     setQuestions(res.data.questions);
// //   };
  

// //   return (
// //     <div style={{ padding: "20px" }}>
// //       {!joined ? (
// //         <div>
// //           <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room ID" />
// //           <button onClick={joinRoom}>Join Room</button>
// //         </div>
// //       ) : (
// //         <div>
// //           <h2>Room: {room}</h2>

// //           {/* Chat UI */}
// //           <div>
// //             <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type message" />
// //             <button onClick={sendMessage}>Send</button>
// //             <div>
// //               <h3>Chat:</h3>
// //               {chat.map((msg, i) => (
// //                 <div key={i}>{msg}</div>
// //               ))}
// //             </div>
// //           </div>

// //           <hr />

// //           {/* AI Assistant */}
// //           <div>
// //             <h3>AI Assistant</h3>
// //             <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Ask something..." />
// //             <button onClick={askAI}>Ask</button>
// //             <p><b>Reply:</b> {aiReply}</p>
// //           </div>

// //           <hr />

// //           {/* Pomodoro Timer */}
// //           <div>
// //             <h3>Pomodoro Timer</h3>
// //             {timeLeft !== null && (
// //               <h4>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</h4>
// //             )}
// //             <button onClick={startPomodoro}>Start</button>
// //             <button onClick={stopPomodoro}>Stop</button>
// //             {showExtend && <button onClick={extendTime}>Extend by 5 Minutes</button>}
// //           </div>

// //           <hr />

// //           {/* File Upload */}
// //           <div>
// //             <h3>Upload Study Notes</h3>
// //             <input type="file" accept=".txt,.pdf" onChange={(e) => setUploadedFile(e.target.files[0])} />
// //             <button onClick={uploadNote}>Upload</button>
// //             {uploadedFile && (
// //               <>
// //                 <button onClick={summarizeNote}>Summarize Note</button>
// //                 <button onClick={generateQuestions}>Generate Questions</button>
// //               </>
// //             )}

// //             {summary && (
// //               <div>
// //                 <h4>Summary:</h4>
// //                 <p>{summary}</p>
// //               </div>
// //             )}

// //             {questions && (
// //               <div>
// //                 <h4>Generated Questions:</h4>
// //                 <pre>{questions}</pre>
// //               </div>
// //             )}

// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;















// //2nd try:

// import React, { useState } from "react";
// import axios from "axios";

// function App() {
// const [file, setFile] = useState(null);
// const [uploadedFile, setUploadedFile] = useState(null);
// const [summary, setSummary] = useState("");
// const [questions, setQuestions] = useState("");

// const handleFileChange = (e) => {
// setFile(e.target.files[0]);
// };

// const uploadFile = async () => {
// const formData = new FormData();
// formData.append("file", file);

// const res = await axios.post("http://localhost:5000/api/upload", formData);
// setUploadedFile(res.data);
// };

// const summarizeNote = async () => {
// const res = await axios.post("http://localhost:5000/api/summarize", {
// filename: uploadedFile.filename,
// });
// setSummary(res.data.summary);
// };

// const generateQuestions = async () => {
// const res = await axios.post("http://localhost:5000/api/questions", {
// filename: uploadedFile.filename,
// });
// setQuestions(res.data.questions);
// };

// return (
// <div style={{ padding: "2rem" }}>
// <h1>📚 Virtual Study Room</h1>


//   <input type="file" onChange={handleFileChange} />
//   <button onClick={uploadFile}>Upload</button>

//   {uploadedFile && (
//     <>
//       <p>Uploaded: {uploadedFile.originalname}</p>
//       <button onClick={summarizeNote}>Summarize</button>
//       <button onClick={generateQuestions}>Generate Questions</button>
//     </>
//   )}

//   {summary && (
//     <div>
//       <h3>Summary</h3>
//       <p>{summary}</p>
//     </div>
//   )}

//   {questions && (
//     <div>
//       <h3>Questions</h3>
//       <pre>{questions}</pre>
//     </div>
//   )}
// </div>
// );
// }

// export default App;