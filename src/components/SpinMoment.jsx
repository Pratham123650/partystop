const ORBIT = ["BEER", "WINE", "LIQUOR", "SNACKS", "LOTTO"];

export default function SpinMoment() {
  return (
    <section className="section spin-moment" aria-hidden="true">
      <div className="spin-orbit">
        {ORBIT.map((w, i) => (
          <span
            key={w}
            className={`orbit-word ${i % 2 === 0 ? "behind-bottle" : "front-bottle"}`}
            style={{ ["--i"]: i, ["--n"]: ORBIT.length }}
          >
            {w}
          </span>
        ))}
      </div>
      <p className="spin-caption front-bottle">The full Party Stop lineup, one turn at a time.</p>
    </section>
  );
}
