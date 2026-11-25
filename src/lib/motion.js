import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const REDUCED = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED).matches;

// The Lenis instance (null when smooth scrolling is off, e.g. reduced motion).
let lenis = null;
export const setLenis = (instance) => {
  lenis = instance;
};
export const getLenis = () => lenis;

/** Scroll to a section by id, through Lenis when it is running. */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

export { gsap, ScrollTrigger };
