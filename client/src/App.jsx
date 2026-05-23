import { useState } from "react";
import Header from "./components/Header.jsx";
import ArticleInput from "./components/ArticleInput.jsx";
import ModeSelector from "./components/ModeSelector.jsx";
import DigestResult from "./components/DigestResult.jsx";
import Footer from "./components/Footer.jsx";
import "./styles/App.css";

const API_URL = import.meta.env.VITE_API_URL || "";
export default function App() {
  // Separate useState for each concern — mandatory requirement
  const [article, setArticle] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    // Validation
    if (!article.trim()) {
      setError("Please paste a news article before generating.");
      return;
    }
    if (!mode) {
      setError("Please select a digest mode.");
      return;
    }
    if (article.length > 4000) {
      setError("Article exceeds 4000 characters. Please shorten it.");
      return;
    }
    if (loading) return; // Prevent duplicate submit

    setLoading(true);
    setError(null);
    setResult(null);

    try {
        const res = await fetch(`${API_URL}/api/digest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article, mode }),
    });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setArticle("");
    setMode("");
    setResult(null);
    setError(null);
  }

  const charCount = article.length;
  const charWarning = charCount > 3500 && charCount <= 4000;
  const charBlocked = charCount > 4000;

  return (
    <div className="app">
      <div className="noise-overlay" />
      <Header />

      <main className="main">
        <div className={`workspace ${result ? "has-result" : ""}`}>
          {/* Left / Input Panel */}
          <section className="panel panel-input">
            <div className="panel-label">◆ Article Input</div>

            <ArticleInput
              value={article}
              onChange={setArticle}
              charCount={charCount}
              charWarning={charWarning}
              charBlocked={charBlocked}
              disabled={loading}
            />

            <ModeSelector
              selected={mode}
              onSelect={setMode}
              disabled={loading}
            />

            {error && (
              <div className="error-box" role="alert">
                <span className="error-icon">⚠</span> {error}
              </div>
            )}

            <div className="action-row">
              <button
                className="btn-generate"
                onClick={handleGenerate}
                disabled={loading || charBlocked || !article.trim() || !mode}
              >
                {loading ? (
                  <span className="btn-inner">
                    <span className="spinner" />
                    Generating…
                  </span>
                ) : (
                  "Generate Digest →"
                )}
              </button>

              {result && (
                <button className="btn-reset" onClick={handleReset}>
                  Start Over
                </button>
              )}
            </div>
          </section>

          {/* Right / Result Panel */}
          <section className="panel panel-result">
            <div className="panel-label">◆ AI Digest</div>
            <DigestResult result={result} loading={loading} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
