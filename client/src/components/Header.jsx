import "./Header.css";

export default function Header() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="header">
      <div className="header-top">
<span className="header-tag">Digital Intelligence Desk</span>        <span className="header-date">{today}</span>
      </div>
      <div className="masthead">
        <div className="rule thick" />
        <h1 className="masthead-title">
          <span className="title-the">The</span>
          <span className="title-main">AI News Digest</span>
        </h1>
        <div className="rule thick" />
        <p className="masthead-sub">
          "Paste any article. Choose a mode. Get instant intelligence."
        </p>
        <div className="rule thin" />
      </div>
    </header>
  );
}
