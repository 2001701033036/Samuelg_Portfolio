import { useLayoutEffect, useRef } from "react";
import { useHud } from "../../lib/hud";
import { ScrollTrigger } from "../../lib/motion";

/** Bottom-centre progress bar with the current step label. Fill = page scroll progress. */
export default function StepBar() {
  const { step } = useHud();
  const fill = useRef(null);

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1, // measure after the pinned story has added its spacing
      onUpdate: (self) => {
        fill.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-3 left-1/2 z-40 w-[min(440px,calc(100vw-24px))] -translate-x-1/2 md:bottom-5">
      <div className="glass rounded-xl px-4 pb-2.5 pt-2">
        <p className="hud-label flex items-center gap-2 text-white/85">
          <span className="text-lime">●</span>
          <span className="truncate">{step}</span>
        </p>
        <div className="mt-2 h-[2px] overflow-hidden rounded-full bg-white/10">
          <div
            ref={fill}
            className="h-full origin-left bg-gradient-to-r from-lime to-neon-cyan"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
