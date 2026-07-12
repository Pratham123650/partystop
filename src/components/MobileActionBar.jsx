const directions = "https://www.google.com/maps/search/?api=1&query=7235+Allen+Rd+Allen+Park+MI+48101";

export default function MobileActionBar() {
  return (
    <div className="mobile-action-bar" aria-label="Quick store actions">
      <a href="tel:+13139287580"><span>Call</span><b>313 928 7580</b></a>
      <a href={directions} target="_blank" rel="noreferrer"><span>Visit</span><b>Directions ↗</b></a>
    </div>
  );
}
