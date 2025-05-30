const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const chatbotRoute = require("./routes/chatbot");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/chat", chatbotRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});








// const express = require("express");
// const path = require("path");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// require("dotenv").config();

// const chatbotRoute = require("./routes/chatbot");

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(bodyParser.json());

// // ✅ Serve React static files from ../client/build
// app.use(express.static(path.join(__dirname, "..", "client", "build")));

// // ✅ API route
// app.use("/api/chat", chatbotRoute);

// // ✅ Fallback: all other routes -> React frontend
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });











// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// require("dotenv").config();

// const chatbotRoute = require("./routes/chatbot");

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(bodyParser.json());

// app.use("/api/chat", chatbotRoute);

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });















// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");
// const pdfParse = require("pdf-parse");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = 5000;

// // Set your Gemini API Key here
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage });

// // Upload endpoint
// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) return res.status(400).json({ error: "No file uploaded" });

//     const filePath = path.join(__dirname, file.path);
//     let text = "";

//     if (file.mimetype === "application/pdf") {
//       const dataBuffer = fs.readFileSync(filePath);
//       const data = await pdfParse(dataBuffer);
//       text = data.text;
//     } else if (file.mimetype === "text/plain") {
//       text = fs.readFileSync(filePath, "utf8");
//     } else {
//       return res.status(400).json({ error: "Unsupported file type" });
//     }

//     if (!text || text.trim().length === 0) {
//       return res.status(400).json({ error: "Extracted text is empty" });
//     }

//     const summary = await summarizeText(text, req.body.depth || "brief");
//     res.json({ summary });
//   } catch (err) {
//     console.error("Summarization error:", JSON.stringify(err, null, 2));
//     res.status(500).json({ error: "Something went wrong while summarizing the document." });
//   }
// });

// // Summarization logic using Gemini
// async function summarizeText(content, level) {
//   const promptMap = {
//     brief: "Summarize this content briefly:\n\n",
//     summarize: "Provide a clear and concise summary:\n\n",
//     detailed: "Generate a detailed summary of the following content:\n\n",
//   };
//   const prompt = promptMap[level.toLowerCase()] || promptMap.brief;

//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
// try {
//   const result = await model.generateContent(prompt + content);
  
// } catch (err) {
//   console.error("Gemini error:", JSON.stringify(err, null, 2));
//   throw err;
// }

//   const response = await result.response;
//   const summary = response.text();
//   return summary;
// }

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




















// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const pdfParse = require("pdf-parse");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const chatbotRoutes = require('./routes/chatbot');

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// app.use('/api', chatbotRoutes);


// // Multer config for file upload
// const upload = multer({
//   dest: "uploads/",
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (ext !== ".pdf" && ext !== ".txt") {
//       return cb(new Error("Only PDF and TXT files are allowed"));
//     }
//     cb(null, true);
//   },
// });

// // Upload endpoint
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   res.json({
//     filename: req.file.filename,
//     originalname: req.file.originalname,
//   });
// });

// // Utility function: split long text into smaller chunks
// function splitTextIntoChunks(text, maxTokens = 1000) {
//   const words = text.split(" ");
//   const chunks = [];
//   let chunk = [];

//   for (let word of words) {
//     if ((chunk.join(" ") + word).split(" ").length > maxTokens) {
//       chunks.push(chunk.join(" "));
//       chunk = [];
//     }
//     chunk.push(word);
//   }
//   if (chunk.length) chunks.push(chunk.join(" "));
//   return chunks;
// }

// // Summarization endpoint using Gemini
// app.post("/api/summarize", async (req, res) => {
//   const { filename, depth = "brief" } = req.body;
//   const filePath = path.join(__dirname, "uploads", filename);

//   try {
//     const buffer = fs.readFileSync(filePath);
//     const text = filename.endsWith(".pdf") ? (await pdfParse(buffer)).text : buffer.toString();

//     const chunks = splitTextIntoChunks(text, 1000);
//     const summaries = [];

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     for (const chunk of chunks) {
//       const prompt =
//         depth === "detailed"
//           ? `Please summarize this section in detail:\n\n${chunk}`
//           : `Summarize this section briefly:\n\n${chunk}`;

//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       summaries.push(response.text());
//     }

//     let finalSummary = summaries.join("\n\n");

//     // Re-summarize into one final brief if needed
//     if (depth === "brief") {
//       const finalResult = await model.generateContent(
//         `Make this more concise:\n\n${finalSummary}`
//       );
//       finalSummary = (await finalResult.response).text();
//     }

//     fs.unlink(filePath, (err) => {
//       if (err) console.error("Failed to delete uploaded file:", err);
//     });

//     res.json({ summary: finalSummary });
//   } catch (err) {
//     console.error("Summarization error:", err);
//     res.status(500).send("Summarization failed");
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


