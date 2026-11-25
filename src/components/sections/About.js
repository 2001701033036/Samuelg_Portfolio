import { useLayoutEffect, useRef } from "react";
import { about } from "../../data/content";
import { gsap, MOTION_OK } from "../../lib/motion";
import RevealLines from "../ui/RevealLines";

// Career-path line for the experience card: one point per milestone, rising left to right.
const CHART_W = 320;
const CHART_H = 110;

function CareerChart({ milestones }) {
  const n = milestones.length;
  const pts = milestones.map((_, i) => {
    const x = 12 + (i * (CHART_W - 24)) / (n - 1);
    const y = CHART_H - 16 - (i * (CHART_H - 36)) / (n - 1);
    return [x, y];
  });
  const line = pts
    .map(([x, y], i) => {
      if (i === 0) return `M${x},${y}`;
      const [px, py] = pts[i - 1];
      const cx = (px + x) / 2;
      return `C${cx},${py} ${cx},${y} ${x},${y}`;
    })
    .join(" ");
  const area = `${line} L${pts[n - 1][0]},${CHART_H} L${pts[0][0]},${CHART_H} Z`;

  return (
    <figure className="mt-auto">
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full overflow-visible" role="img" aria-label={`Career path: ${milestones.join(", ")}`}>
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path data-chart-area d={area} fill="url(#chart-fill)" />
        <path data-chart-line d={line} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <circle key={milestones[i]} data-chart-dot cx={x} cy={y} r={i === n - 1 ? 5 : 3.5} fill={i === n - 1 ? "#d4ff3a" : "#22d3ee"} />
        ))}
      </svg>
      <figcaption className="mt-3 flex justify-between gap-2 font-mono text-[9px] uppercase tracking-wider text-white/45 sm:text-[10px]">
        {milestones.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </figcaption>
    </figure>
  );
}

export default function About() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      MOTION_OK,
      () => {
        gsap.from("[data-about-card]", {
          y: 70,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-about-card]", start: "top 85%" },
        });

        gsap.from("[data-stat]", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-stats]", start: "top 85%" },
        });

        // Count-up numbers.
        gsap.utils.toArray("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const counter = { v: 0 };
          el.textContent = "0";
          gsap.to(counter, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
            onUpdate: () => {
              el.textContent = Math.round(counter.v).toString();
            },
          });
        });

        // Line chart draws itself in.
        const line = root.current.querySelector("[data-chart-line]");
        if (line) {
          const len = line.getTotalLength();
          const st = { trigger: line, start: "top 90%" };
          gsap.fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", scrollTrigger: st });
          gsap.from("[data-chart-area]", { opacity: 0, duration: 1.2, delay: 0.8, scrollTrigger: st });
          gsap.from("[data-chart-dot]", { scale: 0, transformOrigin: "50% 50%", duration: 0.4, stagger: 0.35, delay: 0.3, ease: "back.out(3)", scrollTrigger: st });
        }
      },
      root
    );
    return () => mm.revert();
  }, []);

  const { card, quote, stats, stack } = about;

  return (
    <section id="about" ref={root} className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-neon-violet/10 blur-[120px]" />

      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="hud-label mb-5 text-lime">{about.eyebrow}</p>
        <RevealLines lines={about.heading} className="display text-[clamp(34px,7.4vw,124px)]" />

        {/* Speciality card */}
        <article data-about-card className="glass relative mt-14 overflow-hidden rounded-3xl p-6 sm:p-8 md:mt-20 md:p-12">
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-neon-cyan/10 to-transparent" />
          <div className="relative">
            <div className="hud-label flex flex-wrap justify-between gap-2 text-white/45">
              <span className="text-lime">{card.kicker}</span>
              <span>{card.meta}</span>
            </div>
            <h3 className="display mt-5 max-w-4xl text-[clamp(20px,3vw,40px)] leading-[1.1]">{card.title}</h3>
            <p className="mt-6 max-w-[68ch] text-base leading-relaxed text-white/65 md:text-lg">{card.bio}</p>
            <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {card.details.map((d) => (
                <div key={d.label} className="bg-ink/70 px-5 py-4">
                  <dt className="hud-label text-white/40">{d.label}</dt>
                  <dd className="mt-1.5 text-white/90">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </article>

        {/* Quote + stat cards */}
        <div data-stats className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1.4fr_0.9fr]">
          <figure
            data-stat
            className="glass flex min-h-[260px] flex-col rounded-3xl bg-gradient-to-br from-white/[0.03] via-white/[0.02] to-lime/15 p-7"
          >
            <span className="font-display text-3xl font-black text-lime" aria-hidden="true">
              “
            </span>
            <blockquote className="mt-3 text-xl font-medium italic leading-snug text-white/90">{quote.text}</blockquote>
            <figcaption className="mt-auto pt-6">
              <p className="hud-label text-lime">— {quote.by}</p>
              <p className="mt-3 font-mono text-[10px] text-white/40">{quote.note}</p>
            </figcaption>
          </figure>

          {stats.map((s) => (
            <article
              key={s.label}
              data-stat
              className={`glass flex min-h-[260px] flex-col rounded-3xl p-7 ${s.chart ? "border-neon-cyan/30 shadow-[0_0_60px_-20px_rgba(34,211,238,0.5)]" : ""}`}
            >
              <h3 className="display max-w-[14ch] text-sm leading-tight text-white/85">{s.label}</h3>
              <p className="mt-4 font-display text-6xl font-black tracking-tight">
                <span data-count={s.value}>{s.value}</span>
                <span className="text-3xl text-white/70">{s.suffix}</span>
              </p>
              <p className="mt-2 font-mono text-[11px] text-white/45">{s.note}</p>
              {s.chart && <CareerChart milestones={s.milestones} />}
            </article>
          ))}
        </div>
      </div>

      {/* Tech stack marquee */}
      <div className="relative mt-20 border-y border-white/10 bg-white/[0.02] py-5 md:mt-28">
        <h3 className="sr-only">Tech stack</h3>
        <ul className="sr-only">
          {stack.map((t) => (
            <li key={t.name}>{t.name}</li>
          ))}
        </ul>
        <div aria-hidden="true" className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {stack.map(({ name, Icon, color }) => (
                  <span key={name} className="flex items-center gap-3 px-6 md:px-8">
                    <Icon className="h-6 w-6 md:h-7 md:w-7" style={{ color }} />
                    <span className="display whitespace-nowrap text-xl text-white/90 md:text-3xl">{name}</span>
                    <span className="ml-6 text-white/25 md:ml-8">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
