import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';

function PostRequestdemo() {
  const [inputText, setInputText] = useState('');
  const [classificationText, setClassificationText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [result, setResult] = useState({ summary: '', classification: '', responseSummary: '' });
  const [loading, setLoading] = useState(false);

  const summarizeText = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      if (!response.ok) throw new Error("Failed to summarize the text");
      const data = await response.json();
      setResult((prev) => ({ ...prev, summary: data.generated_summary }));
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while summarizing the text.");
    } finally {
      setLoading(false);
    }
  };

  const classifyText = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: classificationText }),
      });
      if (!response.ok) throw new Error("Failed to classify the text");
      const data = await response.json();
      setResult((prev) => ({ ...prev, classification: `${data.department} (${data.confidence * 100}%)` }));
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while classifying the text.");
    } finally {
      setLoading(false);
    }
  };

  const summarizeResponseText = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/text-summarize-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: responseText }),
      });
      if (!response.ok) throw new Error("Failed to summarize the response text");
      const data = await response.json();
      setResult((prev) => ({ ...prev, responseSummary: data.generated_response_summary }));
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while summarizing the response text.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent, action: () => void) => {
    e.preventDefault();
    action();
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Model Demonstration</h1>

        {/* Summarization */}
        {/* <form onSubmit={(e) => handleSubmit(e, summarizeText)} className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Request Summarization</h2>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows={5}
            placeholder="Enter text for summarization..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Processing..." : "Summarize Text"}
          </button>
        </form>
        {result.summary && (
          <div className="mb-4">
            <strong>Summary:</strong> {result.summary}
          </div>
        )} */}

        Response Summarization
        <form onSubmit={(e) => handleSubmit(e, summarizeResponseText)} className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Response Summarization</h2>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows={5}
            placeholder="Enter response text for summarization..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Processing..." : "Summarize Response"}
          </button>
        </form>
        {result.responseSummary && (
          <div className="mb-4">
            <strong>Response Summary:</strong> {result.responseSummary}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default PostRequestdemo;
