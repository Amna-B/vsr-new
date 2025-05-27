import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [depth, setDepth] = useState("brief"); // 'brief' or 'detailed'

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary(""); // Clear summary on new file
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload the file
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { filename } = uploadRes.data;

      // Step 2: Request summarization
      const summarizeRes = await axios.post("http://localhost:5000/api/summarize", {
        filename,
        depth,
      });

      setSummary(summarizeRes.data.summary);
    } catch (error) {
      console.error("Error during upload/summarization:", error);
      alert("Failed to upload or summarize. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Upload Notes</h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 block"
        accept=".pdf,.txt"
      />

      <div className="mb-4">
        <label className="block font-medium mb-1">Summarization Depth:</label>
        <select
          value={depth}
          onChange={(e) => setDepth(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="brief">Brief (1 paragraph)</option>
          <option value="detailed">Detailed (multi-paragraph)</option>
        </select>
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Summarizing..." : "Upload & Summarize"}
      </button>

      {summary && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">📄 Summary:</h3>
          <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
