import { useEffect, useRef, useState } from "react";
import { capabilities, person, sections, socials } from "../../data/content";
import { useHud } from "../../lib/hud";
import { getLenis, scrollToId } from "../../lib/motion";

const navLinks = sections.filter((s) => s.nav);

export default function Navbar() {
  const { section } = useHud();
  const [capsOpen, setCapsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const capsRef = useRef(null);

  // Close the capabilities dropdown on outside click / Escape.
  useEffect(() => {
    if (!capsOpen) return undefined;
    const onDown = (e) => !capsRef.current?.contains(e.target) && setCapsOpen(false);
    const onKey = (e) => e.key === "Escape" && setCapsOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [capsOpen]);

  // Full-screen menu: lock scrolling and close on Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const lenis = getLenis();
    lenis?.stop();
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const go = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    setCapsOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5">
        <div className="glass mx-auto flex h-14 max-w-[1600px] items-center justify-between rounded-2xl pl-2 pr-2 md:pl-3">
          <div className="flex items-center gap-2" ref={capsRef}>
            <a
              href="#prologue"
              onClick={go("prologue")}
              aria-label={`${person.fullName}, back to top`}
              className="focus-ring grid h-10 w-10 place-items-center rounded-xl bg-white/5 font-display text-[11px] font-black tracking-tight text-white"
            >
              SG
            </a>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCapsOpen((o) => !o)}
                aria-expanded={capsOpen}
                aria-controls="caps-menu"
                className="focus-ring hud-label flex h-9 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 text-white/90 transition-colors hover:border-lime/60"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_2px_rgba(212,255,58,.7)]" />
                <span className="hidden sm:inline">Capabilities</span>
                <span className="sm:hidden">Skills</span>
                <span aria-hidden="true" className={`transition-transform ${capsOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>
              {capsOpen && (
                <ul
                  id="caps-menu"
                  className="glass absolute left-0 top-full mt-3 w-[min(320px,calc(100vw-24px))] animate-pop-in rounded-2xl bg-ink/80 p-2"
                >
                  {capabilities.map((c) => (
                    <li key={c.title} className="rounded-xl px-3 py-2.5 hover:bg-white/5">
                      <p className="hud-label text-lime">{c.title}</p>
                      <p className="mt-1 text-sm text-white/70">{c.detail}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center">
                {navLinks.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={go(id)}
                      aria-current={section === id ? "true" : undefined}
                      className={`focus-ring hud-label relative block rounded-full px-4 py-2.5 transition-colors hover:text-white ${
                        section === id ? "text-white" : "text-white/55"
                      }`}
                    >
                      {label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-4 bottom-1 h-px bg-lime transition-transform duration-300 origin-left ${
                          section === id ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              className="focus-ring ml-1 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 transition-colors hover:border-lime/60"
            >
              <span aria-hidden="true" className="grid grid-cols-2 gap-[3px]">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-[3px] w-[3px] rounded-full bg-white" />
                ))}
              </span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[80] flex animate-fade-in flex-col bg-ink/95 px-6 pb-10 pt-6 backdrop-blur-xl md:px-12"
        >
          <div className="flex items-center justify-between">
            <span className="hud-label text-lime">› Navigation</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              autoFocus
              className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white/15 text-xl"
            >
              ✕
            </button>
          </div>
          <nav aria-label="Menu" className="my-auto">
            <ul className="flex flex-col gap-2">
              {sections.map(({ id, label }, i) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={go(id)}
                    className="focus-ring group flex items-baseline gap-4 rounded-lg py-1"
                  >
                    <span className="hud-label text-white/40">0{i}</span>
                    <span className="display text-[clamp(36px,8vw,88px)] text-white/90 transition-colors group-hover:text-lime">
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white/60">
            <a className="focus-ring rounded hover:text-lime" href={`mailto:${person.email}`}>
              {person.email}
            </a>
            <div className="flex gap-4">
              {socials.map(({ label, href }) => (
                <a key={label} className="focus-ring hud-label rounded hover:text-lime" href={href} target="_blank" rel="noopener noreferrer">
                  {label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
