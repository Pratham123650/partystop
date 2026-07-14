/** Static high-quality fallback for the 3D bottle (also the Suspense fallback). */
export default function StaticBottle() {
  return (
    <div className="bottle-fallback" aria-hidden="true">
      <svg viewBox="0 0 200 460" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fbGlass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6a4310" />
            <stop offset="0.4" stopColor="#c88a2d" />
            <stop offset="0.6" stopColor="#e2ab52" />
            <stop offset="1" stopColor="#7a4d14" />
          </linearGradient>
          <linearGradient id="fbSheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M83 30 h34 v22 c0 6 -3 9 -3 14 v28 c0 22 30 34 30 70 v256 a20 20 0 0 1 -20 20 H76 a20 20 0 0 1 -20 -20 V164 c0 -36 30 -48 30 -70 V66 c0 -5 -3 -8 -3 -14 z"
          fill="url(#fbGlass)"
        />
        <rect x="70" y="120" width="10" height="270" rx="5" fill="url(#fbSheen)" />
        <rect x="80" y="18" width="40" height="20" rx="5" fill="#1b1c1a" />
        <rect x="62" y="230" width="76" height="96" rx="4" fill="#f5f0e7" stroke="#7c292d" strokeWidth="3" />
        <text x="100" y="268" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" fill="#7c292d">PARTY</text>
        <text x="100" y="290" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" fill="#264d73">STOP</text>
        <text x="100" y="312" textAnchor="middle" fontFamily="Georgia, serif" fontSize="7.5" fill="#4a3c2a">ALLEN PARK, MICHIGAN</text>
        <ellipse cx="100" cy="446" rx="62" ry="9" fill="#1b1c1a" opacity="0.14" />
      </svg>
    </div>
  );
}
