import "./ArticleInput.css";

export default function ArticleInput({
  value,
  onChange,
  charCount,
  charWarning,
  charBlocked,
  disabled,
}) {
  return (
    <div className="article-input-wrap">
      <label className="input-label" htmlFor="article">
        Paste News Article
        <span className="input-hint">Full text, headline, or excerpts</span>
      </label>

      <textarea
        id="article"
        className={`article-textarea ${charWarning ? "warn" : ""} ${charBlocked ? "blocked" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your news article here…&#10;&#10;e.g. 'Scientists announced today that a new battery technology could triple the range of electric vehicles...'"
        rows={12}
        disabled={disabled}
      />

      <div className="char-row">
        <span className={`char-count ${charWarning ? "warn" : ""} ${charBlocked ? "error" : ""}`}>
          {charCount.toLocaleString()} / 4,000 characters
        </span>
        {charWarning && !charBlocked && (
          <span className="char-msg warn-msg">⚠ Approaching limit</span>
        )}
        {charBlocked && (
          <span className="char-msg error-msg">✕ Over limit — please shorten</span>
        )}
      </div>
    </div>
  );
}
