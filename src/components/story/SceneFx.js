/*
 * Effects that surround the portrait in each story scene.
 * Every scene renders a "back" layer (behind the portrait) and a "front" layer (in front).
 * Positions are % of the portrait rig, so effects travel with the portrait.
 *
 * Nothing here animates by itself: the Story timeline drives these hooks on scroll.
 *   data-pop    → pops in (scale + fade), staggered
 *   data-draw   → SVG stroke draws on (pathLength = 1)
 *   data-type   → text line is revealed left → right, like typing
 *   data-drift  → parallax: moves up by (value × distance) across the scene
 *   data-led    → server light switches on
 *   data-step   → pipeline step lights up, in order
 *   data-ring   → deployment progress ring fills
 *   data-count  → number counts 0 → 100
 *   data-cursor → design cursor moves around the frame
 * Elements carrying these hooks never use Tailwind transform classes (GSAP owns their transform).
 */

/** Absolutely positioned anchor: places its child centred on (left, top). */
function At({ left, top, drift, className = "", children }) {
  return (
    <span data-drift={drift} className={`absolute ${className}`} style={{ left, top }}>
      <span className="block -translate-x-1/2 -translate-y-1/2">{children}</span>
    </span>
  );
}

/* ----------------------------------------------------------------------------- DESIGN */

const SWATCHES = ["#d4ff3a", "#22d3ee", "#8b5cf6", "#f472b6", "#f8fafc"];

function DesignBack() {
  return (
    <>
      {/* Layout guides */}
      <span className="ps-guide left-[18%] top-[-10%] h-[120%] w-px" />
      <span className="ps-guide left-[82%] top-[-10%] h-[120%] w-px" />
      <span className="ps-guide left-[-20%] top-[8%] h-px w-[140%]" />
      {/* Pen-tool curve sweeping behind the head */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-[-10%] h-[120%] w-[120%] overflow-visible">
        <path
          data-draw
          pathLength="1"
          d="M2 62 C 18 10, 52 4, 66 22 S 92 60, 98 30"
          className="ps-stroke stroke-lime"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <At left="-8%" top="56%">
        <span data-pop className="ps-anchor" />
      </At>
      <At left="73%" top="14%">
        <span data-pop className="ps-anchor" />
      </At>
    </>
  );
}

function DesignFront() {
  return (
    <>
      {/* Figma-style selection frame around Samuel */}
      <div data-type className="ps-frame left-[14%] right-[14%] top-[4%] bottom-[30%]">
        <span className="ps-frame-label">Frame · samuel.fig</span>
        <i className="-left-[0.35em] -top-[0.35em]" />
        <i className="-right-[0.35em] -top-[0.35em]" />
        <i className="-bottom-[0.35em] -left-[0.35em]" />
        <i className="-bottom-[0.35em] -right-[0.35em]" />
        <span className="ps-frame-size">1080 × 1350</span>
      </div>

      {/* Colour palette */}
      <At left="-6%" top="40%" drift="1.2">
        <div data-pop className="ps-card flex-col">
          <span className="ps-card-label">Palette</span>
          <span className="flex gap-[0.45em]">
            {SWATCHES.map((c) => (
              <span key={c} data-pop className="ps-swatch" style={{ background: c, color: c }} />
            ))}
          </span>
        </div>
      </At>

      {/* Typography */}
      <At left="90%" top="15%" drift="1.6">
        <div data-pop className="ps-card">
          <span className="font-display text-[2.6em] font-black leading-none text-white">Aa</span>
          <span className="ps-card-label">
            Unbounded
            <br />
            900 · 64px
          </span>
        </div>
      </At>

      {/* Components */}
      <At left="90%" top="50%" drift="0.8">
        <div data-pop className="ps-card flex-col items-start">
          <span className="ps-card-label">Components</span>
          <span className="rounded-full bg-lime px-[1em] py-[0.35em] font-mono text-[0.95em] font-bold text-ink">Book slot →</span>
          <span className="flex items-center gap-[0.5em] text-white/70">
            <span className="ps-toggle">
              <i />
            </span>
            Dark mode
          </span>
        </div>
      </At>

      {/* User flow */}
      <At left="4%" top="76%" drift="0.6">
        <div data-pop className="ps-card gap-[0.5em] font-mono text-[0.9em]">
          {["Open", "Search", "Book", "Done"].map((s, i) => (
            <span key={s} className="flex items-center gap-[0.5em]">
              <span className={i === 3 ? "text-lime" : "text-cyan-200"}>{s}</span>
              {i < 3 && <span className="text-white/30">→</span>}
            </span>
          ))}
        </div>
      </At>

      {/* Multiplayer cursor */}
      <span data-cursor className="absolute left-[60%] top-[34%]">
        <span className="ps-cursor">
          <svg viewBox="0 0 16 16" className="h-[1.4em] w-[1.4em]" aria-hidden="true">
            <path d="M1 1 L15 7 L8 9 L6 15 Z" fill="#d4ff3a" />
          </svg>
          <b>Samuel</b>
        </span>
      </span>
    </>
  );
}

/* ---------------------------------------------------------------------------- DEVELOP */

const CODE = [
  ["text-violet-300", "public class TicketsController : ControllerBase"],
  ["text-cyan-300", "const api = express().use(router);"],
  ["text-sky-300", "<Dashboard user={me} theme=\"neon\" />"],
  ["text-lime", "✓ Compiled successfully in 2.1s"],
];

const SYMBOLS = [
  ["</>", "18%", "-4%", "1.8", "text-cyan-300"],
  ["{ }", "-10%", "22%", "1.2", "text-violet-300"],
  ["=>", "108%", "10%", "2.2", "text-lime"],
  ["C#", "104%", "38%", "1.4", "text-violet-300"],
  [".NET", "-14%", "64%", "0.9", "text-violet-200"],
  ["npm", "92%", "-2%", "1.1", "text-rose-300"],
  ["JSX", "112%", "62%", "1.7", "text-cyan-200"],
];

function Screen({ className, tilt }) {
  return (
    <div data-pop className={`absolute ${className}`} style={{ perspective: "900px" }}>
      <div className="ps-screen" style={{ transform: `rotateY(${tilt})` }}>
        {[72, 48, 86, 36, 64, 54, 80, 40].map((w, i) => (
          <span key={i} data-type className="ps-code-bar" style={{ width: `${w}%`, marginLeft: `${(i % 3) * 8}%` }} />
        ))}
      </div>
    </div>
  );
}

function DevelopBack() {
  return (
    <>
      <Screen className="left-[-24%] top-[6%] h-[48%] w-[50%]" tilt="28deg" />
      <Screen className="right-[-24%] top-[10%] h-[44%] w-[48%]" tilt="-28deg" />
      <span data-pop className="ps-beam left-[49%] top-[-20%]" />
    </>
  );
}

function DevelopFront() {
  return (
    <>
      <At left="18%" top="74%" drift="0.7">
        <div data-pop className="ps-card ps-editor flex-col items-start">
          <span className="ps-card-label">src / app · building…</span>
          {CODE.map(([cls, line]) => (
            <code key={line} data-type className={`block whitespace-nowrap font-mono ${cls}`}>
              {line}
            </code>
          ))}
        </div>
      </At>
      {SYMBOLS.map(([sym, left, top, drift, cls]) => (
        <At key={sym} left={left} top={top} drift={drift}>
          <span data-pop className={`ps-symbol ${cls}`}>
            {sym}
          </span>
        </At>
      ))}
    </>
  );
}

/* ----------------------------------------------------------------------------- DEPLOY */

const STEPS = ["Build", "UAT", "API check", "Live"];

function Rack({ className }) {
  return (
    <div data-pop className={`ps-rack ${className}`}>
      {Array.from({ length: 11 }, (_, u) => (
        <span key={u} className="ps-rack-unit">
          <i data-led />
          <i data-led className="ps-led-cyan" />
          <b />
        </span>
      ))}
    </div>
  );
}

function DeployBack() {
  return (
    <>
      <Rack className="left-[-26%] top-[4%] h-[70%] w-[26%]" />
      <Rack className="right-[-26%] top-[8%] h-[64%] w-[26%]" />
      {/* Progress ring behind the head */}
      <svg viewBox="0 0 100 100" className="absolute left-[12%] top-[-4%] w-[76%] overflow-visible">
        <circle cx="50" cy="50" r="46" className="ps-ring-track" />
        <circle data-ring cx="50" cy="50" r="46" pathLength="1" className="ps-ring" transform="rotate(-90 50 50)" />
      </svg>
    </>
  );
}

function DeployFront() {
  return (
    <>
      <At left="84%" top="15%" drift="1.4">
        <div data-pop className="ps-card flex-col items-start">
          <span className="ps-card-label">Deploying</span>
          <span data-count className="font-display text-[2.2em] font-black leading-none text-cyan-300">
            0%
          </span>
        </div>
      </At>
      <At left="50%" top="78%" drift="0.6">
        <ol data-pop className="ps-card ps-pipeline">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-[0.6em]">
              <span className="ps-step">
                <span data-step className={i === STEPS.length - 1 ? "ps-step-live" : ""}>
                  {i === STEPS.length - 1 ? "●" : "✓"}
                </span>
              </span>
              <span className="whitespace-nowrap">{s}</span>
              {i < STEPS.length - 1 && <span className="text-white/25">—</span>}
            </li>
          ))}
        </ol>
      </At>
      <At left="2%" top="30%" drift="1.1">
        <span data-pop className="ps-status">API · 200 OK</span>
      </At>
      <At left="96%" top="40%" drift="1.8">
        <span data-pop className="ps-status ps-status-live">● LIVE</span>
      </At>
    </>
  );
}

/* ----------------------------------------------------------------------------- CLIENT */

const NODES = [
  ["Client", 88, 10, "1.2", true],
  ["Staff training", -8, 22, "1.6"],
  ["User feedback", 106, 44, "0.9"],
  ["Developer sync", -12, 52, "1.3"],
  ["Ongoing support", 80, 72, "0.7"],
];
const HUB = [50, 28];

function ClientBack() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
      <ellipse data-draw pathLength="1" cx="50" cy="30" rx="58" ry="34" className="ps-stroke stroke-violet-400/60" vectorEffect="non-scaling-stroke" />
      {NODES.map(([label, x, y]) => (
        <line
          key={label}
          data-draw
          pathLength="1"
          x1={HUB[0]}
          y1={HUB[1]}
          x2={x}
          y2={y}
          className="ps-stroke stroke-cyan-300/70"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

function ClientFront() {
  return (
    <>
      {NODES.map(([label, x, y, drift, main]) => (
        <At key={label} left={`${x}%`} top={`${y}%`} drift={drift}>
          <span data-pop className={`ps-node ${main ? "ps-node-main" : ""}`}>
            <span className="text-lime">✓</span> {label}
          </span>
        </At>
      ))}
      <At left="50%" top="80%" drift="0.5">
        <span data-pop className="ps-success">
          <span className="ps-success-check">✓</span> Delivered · trusted · supported
        </span>
      </At>
    </>
  );
}

export const SCENE_FX = [
  { back: DesignBack, front: DesignFront },
  { back: DevelopBack, front: DevelopFront },
  { back: DeployBack, front: DeployFront },
  { back: ClientBack, front: ClientFront },
];
