// ✅ App.js (frontend)
import React, { useState } from "react";
import banner from "./assets/banner.png";

export default function App() {
  const [url, setUrl] = useState("");
  const [pageType, setPageType] = useState("Homepage");
  const [score, setScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeWebsite = async () => {
    setLoading(true);
    setScore(null);
    setRecommendations([]);
    setChecklist([]);

    try {
      const res = await fetch("https://design-analyzer-backend.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, pageType }),
      });
      const data = await res.json();
      if (data.analysis) {
        console.log("🧠 GPT response:", data.analysis);
        const sections = data.analysis.split("##");
        const scoreMatch = data.analysis.match(/Design Score: (\d+)/);
        setScore(scoreMatch ? parseInt(scoreMatch[1], 10) : null);

        const recSection = sections.find(s => s.includes("Recommendations"));
        const recs = recSection ? recSection.split("\n").slice(1).filter(Boolean) : [];
        setRecommendations(recs);

        const checklistSection = sections.find(s => s.includes("Advanced UX Checklist"));
        const checks = checklistSection
          ? checklistSection
              .split("\n")
              .filter(line => line.trim().startsWith("|") && line.includes("|"))
              .filter(line => !/^\|[-\s]+\|[-\s]+\|$/.test(line)) // skip divider row
          : [];

        const parsedChecklist = checks.map(row => {
          const parts = row.split("|").map(cell => cell.trim()).filter(Boolean);
          if (parts.length === 2) {
            return { category: parts[0], status: parts[1] };
          }
          return null;
        }).filter(Boolean);

        setChecklist(parsedChecklist);
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
      {/* Banner */}
      <div className="relative w-full h-[30vh] overflow-hidden">
        <img
          src={banner}
          alt="Design Analyzer Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-2">Website Design Analyzer</h1>
          <p className="text-white text-lg md:text-xl">Get instant UX/UI feedback to boost conversions</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="flex justify-center mt-8 px-4">
        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-4">
          <input
            type="url"
            placeholder="Enter your website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
            className="w-full sm:w-[200px] p-3 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Homepage">Homepage</option>
            <option value="PLP">Product Listing Page (PLP)</option>
            <option value="PDP">Product Detail Page (PDP)</option>
            <option value="Blog">Blog Page</option>
          </select>
          <button
            onClick={analyzeWebsite}
            disabled={loading || !url}
            className="px-6 py-3 text-lg bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      {/* Results */}
      {score !== null && (
        <div className="flex justify-center mt-10 px-4">
          <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full text-left">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Design Score: <span className="text-blue-600">{score}/100</span>
            </h2>

            {recommendations.length > 0 && (
              <>
                <h3 className="text-2xl font-semibold mb-2">Recommendations</h3>
                <ul className="list-disc list-inside text-gray-700 text-lg space-y-2 mb-6">
                  {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </>
            )}

            {checklist.length > 0 && (
              <>
                <h3 className="text-2xl font-semibold mb-2">Advanced UX Checklist</h3>
                <table className="table-auto w-full text-left text-gray-700">
                  <thead>
                    <tr>
                      <th className="border-b py-2 pr-4">Category</th>
                      <th className="border-b py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checklist.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2 pr-4 border-b">{item.category}</td>
                        <td className="py-2 border-b">{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
