import "./ModeSelector.css";

// Config array — map() renders all buttons from this single source of truth
const MODES = [
  {
    key: "summary",
    label: "Summary",
    icon: "◈",
    desc: "Concise overview",
  },
  {
    key: "keyFacts",
    label: "Key Facts",
    icon: "◉",
    desc: "Bullet-point facts",
  },
  {
    key: "eli5",
    label: "ELI5",
    icon: "◎",
    desc: "Explain simply",
  },
  {
    key: "biasCheck",
    label: "Bias Check",
    icon: "◍",
    desc: "Detect framing",
  },
];

export default function ModeSelector({ selected, onSelect, disabled }) {
  return (
    <div className="mode-wrap">
      <span className="mode-label">Select Digest Mode</span>
      <div className="mode-grid">
        {/* map() renders all mode buttons from the MODES config array */}
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            className={`mode-btn ${selected === m.key ? "active" : ""}`}
            onClick={() => onSelect(m.key)}
            disabled={disabled}
            title={m.desc}
          >
            <span className="mode-icon">{m.icon}</span>
            <span className="mode-name">{m.label}</span>
            <span className="mode-desc">{m.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
