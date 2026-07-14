export default function Wordmark({ light = false, href = '#main' }) {
  return (
    <a
      className={`wordmark ${light ? 'wordmark--light' : ''}`}
      href={href}
      aria-label="Party Stop — home"
    >
      <span className="wordmark__arrow wordmark__arrow--l" aria-hidden="true">
        →
      </span>
      <span className="wordmark__party">Party</span>
      <span className="wordmark__stop">Stop</span>
      <span className="wordmark__arrow wordmark__arrow--r" aria-hidden="true">
        ←
      </span>
    </a>
  );
}
