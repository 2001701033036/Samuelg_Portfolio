import { useHud } from "../../lib/hud";
import useScrambleText from "../../lib/useScrambleText";

/** Top-left HUD label that re-types itself whenever the section / scene changes. */
export default function StatusLabel() {
  const { status } = useHud();
  const ref = useScrambleText(status);

  return (
    <div className="pointer-events-none fixed left-3 top-[78px] z-40 md:left-5 md:top-[84px]">
      <div className="glass hud-label flex items-center gap-2 rounded-full px-3 py-1.5 text-white/80">
        <span className="text-lime">›</span>
        <span ref={ref} aria-hidden="true" className="min-w-[1ch]" />
        <span className="sr-only" aria-live="polite">
          {status}
        </span>
      </div>
    </div>
  );
}
