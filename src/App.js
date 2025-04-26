import React, { useState } from "react";
import banner from "./assets/banner.png"; // Make sure you have banner.png inside src/assets/

export default function App() {
  const [url, setUrl] = useState("");
  const [score, setScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [mockupUrl, setMockupUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ New Real Analyze Website function using backend API
  const analyzeWebsite = async () => {
    setLoading(true);
    setScore(null);
    setRecommendations([]);
    setMockupUrl("");

    try {
      const res = await fetch('https://design-analyzer-backend.onrender.com/analyze', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.analysis) {
        const [scorePart, ...recParts] = data.analysis.split('\n').filter(line => line.trim() !== '');
        const scoreMatch = scorePart.match(/\d+/);
        setScore(scoreMatch ? parseInt(scoreMatch[0], 10) : 70);
        setRecommendations(recParts.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
      setRecommendations(["Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ Banner Section */}
      <div className="relative w-full h-[30vh] overflow-hidden">
        <img
          src={banner}
          alt="Design Score Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 grid place-items-center px-4">
          <div className="text-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-2">
              Website Design Analyzer
            </h1>
            <p className="text-white text-lg md:text-xl">
              Get immediate feedback to improve conversions
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Input Section */}
      <div className="flex justify-center mt-8 px-4">
        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-4">
          <input
            type="url"
            placeholder="Enter your website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={analyzeWebsite}
            disabled={loading || !url}
            className="px-6 py-3 text-lg bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      {/* ✅ Results Section */}
      {score !== null && (
        <div className="flex justify-center mt-10 px-4">
          <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Design Score: <span className="text-blue-600">{score}/100</span>
            </h2>

            <ul className="list-disc list-inside text-left text-gray-700 text-lg space-y-2 mb-6">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>

            {mockupUrl && (
              <img
                src={mockupUrl}
                alt="Homepage Mockup"
                className="rounded-lg border mx-auto mt-4"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
