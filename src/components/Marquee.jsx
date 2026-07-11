export default function Marquee({ text, direction = "left", speed = 28, variant = "" }) {
  const content = `${text} • `.repeat(6);
  return (
    <div className={`marquee ${variant}`} aria-hidden="true">
      <div
        className={`marquee-track marquee-${direction}`}
        style={{ animationDuration: `${speed}s` }}
      >
        <span>{content}</span>
        <span>{content}</span>
      </div>
    </div>
  );
}
