import { useLayoutEffect, useRef } from "react";
import { work } from "../../data/content";
import { gsap, MOTION_OK } from "../../lib/motion";
import RevealLines from "../ui/RevealLines";

const canTilt = () =>
  window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;

function ProjectCard({ project, featured, wide = false }) {
  const onMove = (e) => {
    if (!canTilt()) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, { rotationY: px * 8, rotationX: -py * 8, transformPerspective: 1000, duration: 0.5, ease: "power2.out" });
  };
  const onLeave = (e) => gsap.to(e.currentTarget, { rotationY: 0, rotationX: 0, duration: 0.7, ease: "power3.out" });

  return (
    <article
      data-project
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`glass group relative flex flex-col overflow-hidden rounded-3xl ${featured ? "md:col-span-2 lg:flex-row" : wide ? "md:col-span-2 md:flex-row" : ""}`}
    >
      {/* neon border glow (opacity only) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 ring-1 ring-inset ring-neon-cyan/60 shadow-[0_0_50px_-10px_rgba(139,92,246,0.7),inset_0_0_40px_-20px_rgba(34,211,238,0.6)] transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
      />
      <div className={`relative overflow-hidden ${featured ? "aspect-video lg:aspect-auto lg:w-3/5" : wide ? "aspect-video md:w-1/2" : "aspect-video"}`}>
        <img
          src={project.image}
          alt={project.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>
      <div className={`flex flex-1 flex-col p-6 md:p-8 ${featured ? "lg:justify-center" : ""}`}>
        <ul className="flex flex-wrap gap-2" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="hud-label rounded-full border border-white/15 px-3 py-1 text-neon-cyan">
              {tag}
            </li>
          ))}
        </ul>
        <h3 className="mt-5 font-display text-2xl font-black leading-tight md:text-3xl">{project.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65 md:text-base">{project.description}</p>
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring hud-label mt-6 inline-flex min-h-[44px] items-center gap-2 self-start rounded-full border border-lime/40 px-5 text-lime transition-colors hover:bg-lime hover:text-ink"
          >
            {project.linkLabel} <span aria-hidden="true">↗</span>
            <span className="sr-only">: {project.title}</span>
          </a>
        ) : (
          <p className="hud-label mt-6 inline-flex min-h-[44px] items-center gap-2 self-start rounded-full border border-white/15 px-5 text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan" aria-hidden="true" />
            {project.internalNote ?? "Private project"}
          </p>
        )}
      </div>
    </article>
  );
}

export default function Work() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      MOTION_OK,
      () => {
        gsap.from("[data-project]", {
          y: 90,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-projects]", start: "top 80%" },
        });
      },
      root
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={root} className="relative py-28 md:py-40">
      <div aria-hidden="true" className="absolute right-0 top-1/3 -z-10 h-[500px] w-[700px] rounded-full bg-neon-blue/10 blur-[120px]" />
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="hud-label mb-5 text-lime">{work.eyebrow}</p>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <RevealLines lines={work.heading} className="display text-[clamp(40px,8vw,130px)]" />
          <p className="max-w-sm text-white/60">{work.intro}</p>
        </div>
        <div data-projects className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2">
          {work.projects.map((p, i) => (
            <ProjectCard
              key={p.title}
              project={p}
              featured={i === 0}
              // After the full-width featured card, an odd leftover card would sit alone: let it span the row.
              wide={i > 0 && i === work.projects.length - 1 && (work.projects.length - 1) % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
