import Wordmark from './Wordmark.jsx';
import { STORE } from '../lib/constants.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div>
            <Wordmark light />
            <address style={{ marginTop: 16 }}>
              {STORE.address1}
              <br />
              {STORE.address2}
              <br />
              <a href={STORE.phoneHref}>{STORE.phoneDisplay}</a>
            </address>
          </div>
          <nav aria-label="Footer">
            <ul className="footer__links">
              <li>
                <a href="#main">Home</a>
              </li>
              <li>
                <a href="#selection">Selection</a>
              </li>
              <li>
                <a href="#essentials">Essentials</a>
              </li>
              <li>
                <a href="#gallery">Gallery</a>
              </li>
              <li>
                <a href="#visit">Visit</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer__legal">
          <span>© {new Date().getFullYear()} Party Stop · Allen Park, MI</span>
          <span>Must be 21+ to purchase alcohol. Please drink responsibly.</span>
        </div>
      </div>
    </footer>
  );
}
