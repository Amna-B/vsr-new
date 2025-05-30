const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai"); // Correct import

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // Initialize with API key
});

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

try {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    { role: "user", parts: [{ text: message }] },
  ]);

  const reply = result.response.text();

  res.json({ reply });
} catch (error) {
  console.error("Error interacting with Gemini:", error.message);
  res.status(500).json({ error: "Failed to generate response from Gemini" });
}

});

module.exports = router;






// const express = require('express');
// const router = express.Router();
// const genAI = require('@google/genai');
// require('dotenv').config();

// const apiKey = process.env.GEMINI_API_KEY;

// if (!apiKey) {
//   throw new Error("GEMINI_API_KEY is missing from your .env file.");
// }

// const genAIClient = new genAI.GoogleGenerativeAI(apiKey);

// async function generateResponseWithRetry(prompt, maxRetries = 5) {
//   const model = genAIClient.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

//   for (let attempt = 0; attempt < maxRetries; attempt++) {
//     try {
//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       return response.text();
//     } catch (error) {
//       if (error.status === 429 && attempt < maxRetries - 1) {
//         const delay = Math.pow(2, attempt) * 1000;
//         console.warn(`Rate limited. Retrying in ${delay / 1000} seconds...`);
//         await new Promise((resolve) => setTimeout(resolve, delay));
//       } else {
//         console.error('Gemini API error:', error);
//         throw error;
//       }
//     }
//   }
// }

// router.post('/chat', async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt || typeof prompt !== 'string') {
//     return res.status(400).json({ error: 'Prompt must be a valid string.' });
//   }

//   try {
//     const response = await generateResponseWithRetry(prompt);
//     res.json({ response });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to generate Gemini response.' });
//   }
// });

// module.exports = router;

