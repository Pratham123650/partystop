import { STORE } from '../lib/constants.js';

export default function MobileActionBar() {
  return (
    <div className="mobilebar" role="navigation" aria-label="Quick actions">
      <a href={STORE.phoneHref}>
        <span className="dot" aria-hidden="true">
          ●
        </span>
        CALL
      </a>
      <a href={STORE.directionsHref} target="_blank" rel="noreferrer">
        <span className="dot" aria-hidden="true">
          →
        </span>
        DIRECTIONS
      </a>
    </div>
  );
}
