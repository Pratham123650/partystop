const WORDS = ["LIQUOR", "BEER", "WINE", "LOTTO"];

export default function RotateScene() {
  return (
    <section className="section rotate-scene" aria-hidden="true">
      <div className="rotate-words">
        {WORDS.map((w, i) => (
          <span
            key={w}
            className={`rotate-word ${i % 2 === 0 ? "behind-bottle" : "front-bottle"}`}
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            {w}
          </span>
        ))}
      </div>
      <div className="rotate-arrows front-bottle">→ → →</div>
    </section>
  );
}
