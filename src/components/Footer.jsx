import Marquee from "./Marquee";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-inner footer-inner">
        <div className="footer-top">
          <div>
            <p className="footer-word">PARTY STOP</p>
            <p className="footer-tagline">"Your First Stop for the Party."</p>
          </div>

          <div className="footer-contact">
            <p>7235 Allen Rd<br />Allen Park, MI 48101</p>
            <p><a href="tel:+13139287580">(313) 928-7580</a></p>
          </div>

          <nav className="footer-links" aria-label="Footer">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#selection">Selection</a>
            <a href="#gallery">Gallery</a>
            <a href="#visit">Visit Us</a>
          </nav>
        </div>
      </div>

      <div className="footer-bg-type" aria-hidden="true">PARTY STOP</div>

      <Marquee text="SEE YOU AT PARTY STOP" direction="left" speed={22} variant="marquee-footer" />

      <p className="footer-fine">© {new Date().getFullYear()} Party Stop, Allen Park MI.</p>
    </footer>
  );
}
