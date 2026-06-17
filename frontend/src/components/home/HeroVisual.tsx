export function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual__glow" />
      <div className="hero-visual__shell">
        <div className="hero-visual__grid" />
        <div className="hero-visual__radar" />

        <svg className="hero-visual__svg" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hero-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
              <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="hero-link" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.75" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.18" />
            </linearGradient>
          </defs>

          <circle cx="210" cy="210" r="150" className="hero-visual__ring hero-visual__ring--outer" />
          <circle cx="210" cy="210" r="108" className="hero-visual__ring hero-visual__ring--middle" />
          <circle cx="210" cy="210" r="70" className="hero-visual__ring hero-visual__ring--inner" />

          <path d="M210 58V132 M58 210H132 M288 210H362 M210 288V362" className="hero-visual__trace" />
          <path d="M108 108L162 162 M312 108L258 162 M108 312L162 258 M312 312L258 258" className="hero-visual__trace hero-visual__trace--soft" />

          <path d="M80 210H340" stroke="url(#hero-link)" strokeWidth="1.5" />
          <path d="M210 80V340" stroke="url(#hero-link)" strokeWidth="1.5" />

          <rect x="162" y="170" width="96" height="80" rx="16" className="hero-visual__core" />
          <text x="210" y="200" textAnchor="middle" className="hero-visual__label">
            BACKEND
          </text>
          <text x="210" y="224" textAnchor="middle" className="hero-visual__sublabel">
            ENGINEERING
          </text>

          <g className="hero-visual__node hero-visual__node--a">
            <rect x="48" y="90" width="96" height="44" rx="12" className="hero-visual__chip" />
            <text x="96" y="118" textAnchor="middle" className="hero-visual__chip-text">
              Django + DRF
            </text>
          </g>
          <g className="hero-visual__node hero-visual__node--b">
            <rect x="276" y="90" width="96" height="44" rx="12" className="hero-visual__chip" />
            <text x="324" y="118" textAnchor="middle" className="hero-visual__chip-text">
              Next.js UI
            </text>
          </g>
          <g className="hero-visual__node hero-visual__node--c">
            <rect x="48" y="286" width="96" height="44" rx="12" className="hero-visual__chip" />
            <text x="96" y="314" textAnchor="middle" className="hero-visual__chip-text">
              PostgreSQL
            </text>
          </g>
          <g className="hero-visual__node hero-visual__node--d">
            <rect x="276" y="286" width="96" height="44" rx="12" className="hero-visual__chip" />
            <text x="324" y="314" textAnchor="middle" className="hero-visual__chip-text">
              Docker Flow
            </text>
          </g>

          <circle r="4" className="hero-visual__dot hero-visual__dot--1">
            <animateMotion dur="3.2s" repeatCount="indefinite" path="M96 134 L210 170" />
          </circle>
          <circle r="4" className="hero-visual__dot hero-visual__dot--2">
            <animateMotion dur="3.8s" repeatCount="indefinite" path="M324 134 L210 170" />
          </circle>
          <circle r="4" className="hero-visual__dot hero-visual__dot--3">
            <animateMotion dur="3.4s" repeatCount="indefinite" path="M210 250 L96 286" />
          </circle>
          <circle r="4" className="hero-visual__dot hero-visual__dot--4">
            <animateMotion dur="4.1s" repeatCount="indefinite" path="M210 250 L324 286" />
          </circle>
        </svg>

        <div className="hero-visual__badge hero-visual__badge--tl font-latin">API</div>
        <div className="hero-visual__badge hero-visual__badge--tr font-latin">SCALE</div>
        <div className="hero-visual__badge hero-visual__badge--br font-latin">UX</div>

        <div className="hero-visual__code font-latin">
          <span className="hero-visual__code-line">
            <span className="text-accent">SYSTEM</span> status: online
          </span>
          <span className="hero-visual__code-line hero-visual__code-line--dim">latency 24ms · healthy</span>
        </div>
      </div>
    </div>
  );
}
