import { useEffect, useRef } from "react";
import "./DigestResult.css";

const MODE_LABELS = {
  summary:   "Summary",
  keyFacts:  "Key Facts",
  eli5:      "ELI5 — Plain Language",
  biasCheck: "Bias Analysis",
};

function formatResult(text) {
  // Split on numbered lines or double newlines, return paragraphs/items
  return text
    .split(/\n/)
    .filter((line) => line.trim().length > 0)
    .map((line, i) => {
      const isNumbered = /^\d+[\.\)]/.test(line.trim());
      const isBullet   = /^[-•*]/.test(line.trim());
      const isHeader   = /^\*\*.*\*\*/.test(line.trim()) || /^#+\s/.test(line.trim());
      const clean = line.replace(/\*\*/g, "").replace(/^#+\s/, "").trim();

      if (isHeader) return <h4 key={i} className="result-heading">{clean}</h4>;
      if (isNumbered || isBullet) return <li key={i} className="result-item">{clean.replace(/^\d+[\.\)]\s*/, "").replace(/^[-•*]\s*/, "")}</li>;
      return <p key={i} className="result-para">{clean}</p>;
    });
}

export default function DigestResult({ result, loading }) {
  const ref = useRef(null);

  useEffect(() => {
    if (result) ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  if (loading) {
    return (
      <div className="result-placeholder">
        <div className="loading-press">
          {"ANALYZING".split("").map((ch, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.08}s` }}>{ch}</span>
          ))}
        </div>
        <p className="loading-sub">Groq is processing your article…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-placeholder empty">
        <div className="empty-icon">📰</div>
        <p className="empty-title">Your digest will appear here</p>
        <p className="empty-sub">Paste an article, choose a mode, and generate.</p>
      </div>
    );
  }

  const lines = formatResult(result.result);
  const hasList = lines.some((el) => el.type === "li");

  return (
    <div className="result-content" ref={ref}>
      <div className="result-meta">
        <span className="result-mode-badge">{MODE_LABELS[result.mode] || result.mode}</span>
        {result.usage && (
          <span className="result-tokens">{result.usage.total_tokens} tokens · {result.model}</span>
        )}
      </div>

      <div className="result-rule" />

      <div className="result-body">
        {hasList ? (
          <ul className="result-list">
            {lines}
          </ul>
        ) : (
          lines
        )}
      </div>

      <button
        className="copy-btn"
        onClick={() => {
          navigator.clipboard.writeText(result.result).then(() => {
            const btn = document.querySelector(".copy-btn");
            if (btn) { btn.textContent = "Copied!"; setTimeout(() => { btn.textContent = "Copy Text"; }, 2000); }
          });
        }}
      >
        Copy Text
      </button>
    </div>
  );
}
