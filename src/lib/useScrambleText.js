import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

const GLYPHS = "!<>-_/[]{}=+*^?#01ABCDEFXYZ";

/**
 * Typewriter + glitch: decodes `text` into the returned ref's element.
 * Render the element empty (aria-hidden) and keep a screen-reader copy of the text.
 */
export default function useScrambleText(text, duration = 650) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) {
      el.textContent = text;
      return undefined;
    }
    let raf;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const typed = Math.floor(p * text.length);
      let out = text.slice(0, typed);
      // a short tail of random glyphs ahead of the cursor
      for (let i = typed; i < Math.min(text.length, typed + 4); i++) {
        out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, duration]);

  return ref;
}
