import { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const sendPrompt = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error("Frontend Error:", error);
      setAiResponse("❌ Unable to reach backend. Check server connection.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-6">
        ✈ Travel AI Agent
      </h1>

      <textarea
        className="w-full p-3 border rounded-lg mb-4"
        placeholder="Enter admin prompt (e.g., Plan a Goa trip)..."
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={sendPrompt}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Generate Plan
      </button>

      {aiResponse && (
        <div className="mt-6 p-4 bg-gray-50 border rounded-lg whitespace-pre-line">
          {aiResponse}
        </div>
      )}
    </div>
  );
}
