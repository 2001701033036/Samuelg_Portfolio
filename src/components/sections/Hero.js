import { useLayoutEffect, useRef } from "react";
import { hero, images, person } from "../../data/content";
import { gsap, MOTION_OK, scrollToId } from "../../lib/motion";
import CityPlaceholder from "../ui/CityPlaceholder";
import Media from "../ui/Media";

function BigWord({ text, className = "" }) {
  return (
    <span className={`display flex overflow-hidden py-[0.04em] ${className}`}>
      {[...text].map((char, i) => (
        <span key={`${char}-${i}`} data-letter className="inline-block">
          {char}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      MOTION_OK,
      () => {
        // Intro: background → name letters → portrait → details.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-hero-bg]", { opacity: 0, scale: 1.12, duration: 1.8 })
          .from("[data-letter]", { yPercent: 115, duration: 1.1, stagger: 0.05, ease: "power4.out" }, 0.45)
          .from("[data-hero-portrait]", { y: 160, opacity: 0, duration: 1.4 }, 0.95)
          .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, 1.25);

        // Scroll: names split apart, portrait zooms, background drifts (parallax).
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          })
          .to("[data-hero-parallax]", { yPercent: 14 }, 0)
          .to("[data-name-first]", { xPercent: -24 }, 0)
          .to("[data-name-last]", { xPercent: 24 }, 0)
          .to("[data-hero-zoom]", { scale: 1.12 }, 0)
          .to("[data-hero-details]", { opacity: 0, y: -40 }, 0);
      },
      root
    );
    return () => mm.revert();
  }, []);

  const portraitSrc = images.portrait.ready ? images.portrait.src : images.portrait.fallback;

  return (
    <section id="prologue" ref={root} className="relative isolate overflow-hidden">
      {/* Background city with parallax */}
      <div data-hero-parallax className="absolute inset-x-0 -top-[6%] -z-20 h-[112%]">
        <div data-hero-bg className="h-full w-full">
          <Media
            image={images.heroCity}
            alt=""
            eager
            className="h-full w-full object-cover"
            placeholder={<CityPlaceholder />}
          />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_75%_45%,rgba(124,58,237,0.25),transparent_70%)]" />
      {/* Left-side shade keeps the intro readable over the city */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

      <h1 className="sr-only">
        {person.fullName}: {person.role} & full-stack developer
      </h1>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-5 pb-28 pt-32 md:block md:px-10 md:pb-0 md:pt-0">
        {/* First name: sits BEHIND the portrait */}
        <div data-name-first aria-hidden="true" className="relative z-10 md:absolute md:left-10 md:top-[15vh]">
          <p data-hero-fade className="hud-label mb-3 text-lime md:mb-4">
            {hero.eyebrow}
          </p>
          <BigWord text={person.firstName} className="text-[17vw] text-white md:text-[14.5vw] 2xl:text-[230px]" />
        </div>

        {/* Intro + CTA */}
        <div
          data-hero-details
          className="relative z-30 mt-6 max-w-md md:absolute md:left-10 md:top-[calc(15vh+18vw)] md:mt-0 2xl:top-[calc(15vh+300px)]"
        >
          <p data-hero-fade className="text-base leading-relaxed text-white/75 md:text-lg">
            {hero.intro}
          </p>
          <a
            data-hero-fade
            href={`#${hero.cta.target}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToId(hero.cta.target);
            }}
            className="btn-lime mt-6"
          >
            <span className="h-2 w-2 rounded-full bg-ink" aria-hidden="true" />
            {hero.cta.label} <span aria-hidden="true">→</span>
          </a>
        </div>


        {/* Portrait cutout: between the first name (behind) and the surname (in front) */}
        <div
          data-hero-portrait
          className="pointer-events-none relative z-20 mx-auto mt-8 h-[58svh] w-full md:absolute md:bottom-0 md:right-[12%] md:mt-0 md:h-[88svh] md:w-[44vw]"
        >
          <div aria-hidden="true" className="portrait-glow" />
          <div data-hero-zoom className="h-full w-full origin-bottom">
            <img
              src={portraitSrc}
              alt={`Portrait of ${person.fullName}`}
              fetchPriority="high"
              className="portrait-rim mx-auto h-full w-auto object-contain object-bottom"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-ink to-transparent" />
        </div>

        {/* Surname: IN FRONT of the portrait */}
        <div
          data-name-last
          aria-hidden="true"
          className="relative z-30 -mt-24 self-end text-right md:absolute md:bottom-[13vh] md:right-10 md:mt-0"
        >
          <p data-hero-fade className="hud-label mb-2 text-lime">
            {hero.sideLabel}
          </p>
          <BigWord text={person.lastName} className="justify-end text-[22vw] text-white md:text-[13vw] 2xl:text-[210px]" />
        </div>

        {/* Skill chips */}
        <ul
          data-hero-details
          aria-label="Key skills"
          className="relative z-30 mt-8 flex max-w-xl flex-wrap gap-2 md:absolute md:bottom-[13vh] md:left-10 md:mt-0"
        >
          {hero.chips.map((chip) => (
            <li key={chip} data-hero-fade className="glass hud-label flex items-center gap-2 rounded-full px-3 py-2 text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan" aria-hidden="true" />
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
