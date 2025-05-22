// App.js with updated verbiage, styling for Design Score and Page Speed Score
import React, { useState } from "react";
import banner from "./assets/banner.png";

export default function App() {
  const [url, setUrl] = useState("");
  const [pageType, setPageType] = useState("Homepage");
  const [score, setScore] = useState(null);
  const [pageSpeed, setPageSpeed] = useState(null);
  const [sections, setSections] = useState({});
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeWebsite = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://design-analyzer-backend.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, pageType })
      });
      const data = await res.json();
      setScore(data.score || null);
      setPageSpeed(data.pageSpeed || null);
      setSections(data.analysisSections || {});
      setChecklist(data.checklist || []);
    } catch (err) {
      console.error("Error analyzing:", err);
    } finally {
      setLoading(false);
    }
  };

  const pageOptions = ["Homepage", "PLP", "PDP", "Blog"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-[30vh] overflow-hidden">
        <img src={banner} alt="Design Analyzer Banner" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-2">Website Design Analyzer</h1>
          <p className="text-white text-lg md:text-xl">Get instant UX/UI and performance feedback</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="flex flex-col items-center mt-8 px-4 gap-4">
        <input
          type="url"
          placeholder="Enter your website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full max-w-xl p-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex flex-wrap justify-center gap-2">
          {pageOptions.map((option) => (
            <button
              key={option}
              onClick={() => setPageType(option)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                pageType === option
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          onClick={analyzeWebsite}
          disabled={loading || !url}
          className="mt-4 px-6 py-3 text-lg bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {loading && (
          <p className="mt-4 text-sm text-gray-600">This may take up to 30 seconds depending on the website. Please wait...</p>
        )}

        {/* Results */}
        {sections && Object.keys(sections).length > 0 && (
          <div className="mt-10 max-w-4xl w-full bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Audit Results</h2>

            <div className="text-center mb-6">
              <p className="text-xl font-bold text-blue-700">Design Score: <span className="text-black">{score}</span></p>
              <p className="text-xl font-bold text-green-700">Page Speed Score: <span className="text-black">{pageSpeed}</span></p>
            </div>

            {Object.entries(sections).map(([section, content]) => (
              <div key={section} className="mb-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">{section}</h3>
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded text-sm text-gray-800 border border-gray-200">
                  {content}
                </pre>
              </div>
            ))}

            <h3 className="text-lg font-semibold text-green-700 mt-6 mb-2">Checklist</h3>
            <ul className="list-disc ml-6 space-y-1 text-sm text-gray-800">
              {checklist.map((item, index) => (
                <li key={index}><strong>{item.category}</strong>: {item.status}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
