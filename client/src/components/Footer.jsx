import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-rule" />
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} AI News Digest</span>
        <span className="footer-mid">React · Express · Groq · Llama 3</span>
      </div>
    </footer>
  );
}
