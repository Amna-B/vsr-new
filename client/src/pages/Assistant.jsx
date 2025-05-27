import React, { useState } from "react";
import axios from "axios";

const Assistant = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setChat((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      const botMessage = { sender: "Gemini", text: res.data.reply };
      setChat((prev) => [...prev, botMessage]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "Gemini", text: "Error connecting to the server." },
      ]);
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>Gemini Chat Assistant</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {chat.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "10px" }}>
            <strong>{msg.sender}: </strong>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
          placeholder="Ask something..."
        />
        <button onClick={handleSend} style={{ padding: "8px 16px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Assistant;






























// import React, { useState } from "react";
// import axios from "axios";

// function App() {
//   const [file, setFile] = useState(null);
//   const [depth, setDepth] = useState("brief");
//   const [summary, setSummary] = useState("");

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("depth", depth);

//     try {
//       const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setSummary(uploadRes.data.summary);
//     } catch (err) {
//       console.error("Error during file upload or summarization", err);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "30px", padding: "20px" }}>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: "15px" }}>
//           <label htmlFor="file" style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
//             Upload your document
//           </label>
//           <input type="file" id="file" onChange={onFileChange} />
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label htmlFor="depth" style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
//             Summary Depth
//           </label>
//           <input
//             type="text"
//             id="depth"
//             value={depth}
//             onChange={(e) => setDepth(e.target.value)}
//             placeholder="Enter 'brief' or 'detailed'"
//           />
//         </div>

//         <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#008080", color: "#fff", border: "none", borderRadius: "4px" }}>
//           Upload and Summarize
//         </button>
//       </form>

//       {summary && (
//         <div style={{ marginTop: "30px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
//           <h2>Summary</h2>
//           <p style={{ whiteSpace: "pre-wrap" }}>{summary}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


































































// import { useState } from "react";
// import axios from "axios";

// export default function Assistant() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const [file, setFile] = useState(null);
//   const [summary, setSummary] = useState("");
//   const [depth, setDepth] = useState("brief");
//   const [uploading, setUploading] = useState(false);
//   const [summarizing, setSummarizing] = useState(false);

//   // Chatbot Function
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     try {
//       const res = await axios.post("http://localhost:5000/api/chatbot", {
//         message: input,
//       });

//       const botMessage = {
//         sender: "bot",
//         text: res.data.reply || "Sorry, I didn't get a reply.",
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (err) {
//       console.error("Chatbot error:", err);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Something went wrong. Please try again." },
//       ]);
//     }
//   };

//   // File Upload + Summarization Function
//   const handleUploadAndSummarize = async () => {
//     if (!file) return alert("Please choose a file first.");
//     setUploading(true);
//     setSummary("");

//     try {
//       // Step 1: Upload file
//       const formData = new FormData();
//       formData.append("file", file);
//       const uploadRes = await axios.post("http://localhost:5000/api/upload", formData);
//       const filename = uploadRes.data.filename;

//       // Step 2: Summarize
//       setSummarizing(true);
//       const summaryRes = await axios.post("http://localhost:5000/api/summarize", {
//         filename,
//         depth,
//       });
//       setSummary(summaryRes.data.summary);
//     } catch (err) {
//       console.error("Upload/summarize error:", err);
//       setSummary("Something went wrong while summarizing the document.");
//     } finally {
//       setUploading(false);
//       setSummarizing(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-8">
//       {/* Chatbot Section */}
//       <div className="bg-white border rounded shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
//         <div className="h-64 overflow-y-auto border p-4 mb-4 rounded bg-gray-50">
//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
//             >
//               <span
//                 className={`inline-block px-3 py-2 rounded ${
//                   msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200"
//                 }`}
//               >
//                 {msg.text}
//               </span>
//             </div>
//           ))}
//         </div>

//         <div className="flex">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask something..."
//             className="flex-grow border px-3 py-2 rounded-l"
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-blue-600 text-white px-4 py-2 rounded-r"
//           >
//             Send
//           </button>
//         </div>
//       </div>

//       {/* Summarization Section */}
//       <div className="bg-white border rounded shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Summarize Notes (PDF/TXT)</h2>

//         <input
//           type="file"
//           accept=".pdf,.txt"
//           onChange={(e) => setFile(e.target.files[0])}
//           className="mb-4"
//         />

//         <div className="mb-4">
//           <label className="mr-2">Summary Depth:</label>
//           <select
//             value={depth}
//             onChange={(e) => setDepth(e.target.value)}
//             className="border px-2 py-1"
//           >
//             <option value="brief">Brief</option>
//             <option value="detailed">Detailed</option>
//           </select>
//         </div>

//         <button
//           onClick={handleUploadAndSummarize}
//           disabled={uploading || summarizing}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           {summarizing ? "Summarizing..." : uploading ? "Uploading..." : "Summarize"}
//         </button>

//         {summary && (
//           <div className="mt-6 bg-gray-100 p-4 rounded border">
//             <h3 className="font-bold mb-2">Summary:</h3>
//             <p className="whitespace-pre-wrap">{summary}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
