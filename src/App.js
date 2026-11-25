import { useEffect } from "react";
import Lenis from "lenis";
import "./App.css";
import { sections } from "./data/content";
import { setHud } from "./lib/hud";
import { gsap, prefersReducedMotion, ScrollTrigger, setLenis } from "./lib/motion";
import DotNav from "./components/hud/DotNav";
import Navbar from "./components/hud/Navbar";
import Overlays from "./components/hud/Overlays";
import StatusLabel from "./components/hud/StatusLabel";
import StepBar from "./components/hud/StepBar";
import About from "./components/sections/About";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import Hero from "./components/sections/Hero";
import Story from "./components/sections/Story";
import Work from "./components/sections/Work";

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}

/** Updates the HUD (active section, status, step) as sections cross the viewport centre. */
function useSectionTracking() {
  useEffect(() => {
    const triggers = sections.map((s) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setHud({ section: s.id, status: s.status, step: s.step }),
        onEnterBack: () => setHud({ section: s.id, ...(s.back ?? { status: s.status, step: s.step }) }),
      })
    );
    // Re-measure once fonts and images have settled.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    refresh();
    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("load", refresh);
    };
  }, []);
}

export default function App() {
  useSmoothScroll();
  useSectionTracking();

  return (
    <>
      <a
        href="#about"
        className="focus-ring fixed left-3 top-3 z-[90] -translate-y-24 rounded-full bg-lime px-4 py-2 font-mono text-xs font-bold text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <Overlays />
      <Navbar />
      <StatusLabel />
      <DotNav />
      <StepBar />
      <main>
        <Hero />
        <About />
        <Story />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
