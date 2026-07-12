const LINKS = [["Home", "#home"], ["About", "#about"], ["Selection", "#selection"], ["Gallery", "#gallery"], ["Visit", "#visit"]];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-inner footer-inner">
        <div className="footer-brand"><span>Party</span> Stop<p>Your first stop for the occasion.</p></div>
        <div className="footer-address"><span className="eyebrow">Visit us</span><p>7235 Allen Rd<br />Allen Park, MI 48101</p><a href="tel:+13139287580">(313) 928-7580</a></div>
        <nav className="footer-links" aria-label="Footer navigation">{LINKS.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav>
      </div>
      <div className="footer-bottom section-inner"><span>© {new Date().getFullYear()} Party Stop</span><span>Allen Park, Michigan</span><a href="#home">Back to top ↑</a></div>
    </footer>
  );
}
