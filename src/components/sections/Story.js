import { useLayoutEffect, useRef } from "react";
import { images, scenes } from "../../data/content";
import { setHud } from "../../lib/hud";
import { gsap, MOTION_OK } from "../../lib/motion";
import { SCENE_FX } from "../story/SceneFx";

/*
 * "How I work": a pinned, scroll-scrubbed film starring Samuel's real portrait.
 *
 * One portrait "rig" (photo + rim lighting + scene effects) stays on stage for all four scenes.
 * A single GSAP timeline, scrubbed by ScrollTrigger, moves it through:
 *   enter → DESIGN → DEVELOP → DEPLOY → CLIENT SUCCESS → finale
 * Reduced motion: a static, stacked version (same portrait, same text) is shown instead.
 */

const ME = images.portrait.ready ? images.portrait.src : images.portrait.fallback;

// Scenes with AI artwork play that artwork full-bleed; the others use the animated portrait rig.
const hasMedia = (i) => Boolean(scenes[i].media?.ready);
const isVideo = (src) => /\.(mp4|webm)$/i.test(src);

/** Full-bleed scene artwork (image or looping muted video). */
function SceneMedia({ media, eager = false, still = false }) {
  const style = { objectPosition: media.focus ?? "center" };
  return isVideo(media.src) ? (
    <video
      src={media.src}
      poster={media.poster}
      className="h-full w-full object-cover"
      style={style}
      autoPlay={!still}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "metadata"}
    />
  ) : (
    <img src={media.src} alt="" className="h-full w-full object-cover" style={style} loading={eager ? "eager" : "lazy"} decoding="async" />
  );
}

// Timeline map in "screens" of scroll. Scene i is introduced at START[i] and held until HOLD_END[i].
const START = [0, 1.2, 2.3, 3.4];
const HOLD_END = [0.9, 2.0, 3.1, 4.0];
const END = 4.5;

// Where the rig stands in each scene (% of its own box). The face is never stretched: uniform scale only.
const POSES = {
  desktop: {
    enter: { xPercent: 45, yPercent: 16, scale: 0.8, rotation: 4 },
    scenes: [
      { xPercent: 0, yPercent: 0, scale: 1, rotation: 0 },
      { xPercent: -112, yPercent: 7, scale: 1.04, rotation: 1.5 },
      { xPercent: -14, yPercent: 5, scale: 1.12, rotation: -1.5 },
      { xPercent: -30, yPercent: 0, scale: 1.06, rotation: 0 },
    ],
    finale: { xPercent: -52, yPercent: -2, scale: 1.16, rotation: 0 },
    drift: 45,
  },
  mobile: {
    enter: { xPercent: 0, yPercent: 26, scale: 0.84, rotation: 3 },
    scenes: [
      { xPercent: 0, yPercent: 0, scale: 1, rotation: 0 },
      { xPercent: -7, yPercent: 2, scale: 1.04, rotation: 1.5 },
      { xPercent: 7, yPercent: 3, scale: 1.08, rotation: -1.5 },
      { xPercent: 0, yPercent: 0, scale: 1.1, rotation: 0 },
    ],
    finale: { xPercent: 0, yPercent: -2, scale: 1.16, rotation: 0 },
    drift: 18,
  },
};

// Desktop text-panel placement per scene: always on the side opposite the portrait.
const PANEL_LEFT = "md:bottom-28 md:left-10 md:right-auto";
const PANEL_POS = [PANEL_LEFT, "md:bottom-28 md:left-auto md:right-24", PANEL_LEFT, PANEL_LEFT];

const sceneHud = (i) => ({ status: `TRANSITIONING TO ${scenes[i].short}`, step: scenes[i].step });

function buildTimeline(stage, pin, key) {
  const pose = POSES[key];
  const q = gsap.utils.selector(stage);
  const one = (sel) => stage.querySelector(sel);
  const fx = (i) => q(`[data-fx="${i}"]`);
  const inFx = (i, sel) => q(`[data-fx="${i}"] ${sel}`);

  const rig = one("[data-rig]");
  const camera = one("[data-camera]");
  const floatEl = one("[data-me-float]");

  // ----- initial state
  gsap.set(rig, { ...pose.enter, autoAlpha: 0 });
  gsap.set(q("[data-bg], [data-media], [data-light], [data-fx]"), { autoAlpha: 0 });
  gsap.set(q("[data-panel]"), { autoAlpha: 0, y: 40 });
  gsap.set(q("[data-title]"), { yPercent: 110 });
  gsap.set(q("[data-fx] [data-pop]"), { autoAlpha: 0, scale: 0.5 });
  gsap.set(q("[data-fx] [data-type]"), { clipPath: "inset(-1em 100% -1em -1em)" });
  gsap.set(q("[data-fx] [data-draw], [data-ring]"), { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(q("[data-led], [data-step]"), { autoAlpha: 0.12 });
  gsap.set(q("[data-flash], [data-outro]"), { autoAlpha: 0 });
  gsap.set(q("[data-outro-line]"), { yPercent: 110 });

  // Only the active scene's clip plays (restarting from its first frame); the rest stay paused to save the CPU.
  const videos = scenes.map((_, i) => one(`[data-media="${i}"] video`));
  const playScene = (idx) =>
    videos.forEach((v, j) => {
      if (!v) return;
      if (j !== idx) return v.pause();
      if (v.paused) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    });
  const sceneAt = (progress) => {
    const t = progress * END;
    return t < START[1] - 0.15 ? 0 : t < START[2] - 0.15 ? 1 : t < START[3] - 0.15 ? 2 : 3;
  };
  videos.forEach((v) => v?.pause());

  let current = -1;
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: pin,
      pin: true,
      scrub: 1,
      start: "top top",
      end: () => `+=${END * window.innerHeight}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const idx = sceneAt(self.progress);
        if (idx !== current) {
          current = idx;
          setHud(sceneHud(idx));
          playScene(idx);
        }
      },
      onToggle: (self) => (self.isActive ? playScene(sceneAt(self.progress)) : playScene(-1)),
    },
  });

  const showScene = (i, at) => {
    tl.to(q(`[data-bg="${i}"], [data-media="${i}"]`), { autoAlpha: 1, duration: 0.3 }, at)
      .to(q(`[data-light="${i}"]`), { autoAlpha: 1, duration: 0.3 }, at)
      .to(fx(i), { autoAlpha: hasMedia(i) ? 0 : 1, duration: 0.15 }, at + 0.05)
      .to(q(`[data-panel="${i}"]`), { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, at + 0.1)
      .to(q(`[data-panel="${i}"] [data-title]`), { yPercent: 0, duration: 0.25, ease: "power3.out" }, at + 0.14)
      .to(inFx(i, "[data-pop]"), { autoAlpha: 1, scale: 1, duration: 0.18, stagger: 0.03, ease: "back.out(1.7)" }, at + 0.12);
  };

  const hideScene = (i, at) => {
    tl.to(q(`[data-panel="${i}"]`), { autoAlpha: 0, y: -40, duration: 0.18, ease: "power1.in" }, at)
      .to(fx(i), { autoAlpha: 0, duration: 0.2 }, at + 0.02)
      .to(inFx(i, "[data-pop]"), { scale: 0.7, duration: 0.2, stagger: 0.01, ease: "power1.in" }, at)
      .to(q(`[data-bg="${i}"], [data-media="${i}"], [data-light="${i}"]`), { autoAlpha: 0, duration: 0.3 }, at + 0.05);
  };

  // While a scene is held: the "work" plays out, the camera pushes in, layers drift (parallax).
  const workScene = (i) => {
    const a = START[i] + 0.25;
    const b = HOLD_END[i];
    const span = b - a;
    tl.to(inFx(i, "[data-draw]"), { strokeDashoffset: 0, duration: span * 0.6, stagger: span * 0.05 }, a)
      // Typing: every line finishes within the first ~70% of the hold, however many lines there are.
      .to(
        inFx(i, "[data-type]"),
        { clipPath: "inset(-1em -1em -1em -1em)", duration: span * 0.2, stagger: (span * 0.5) / Math.max(1, inFx(i, "[data-type]").length) },
        a
      )
      .fromTo(
        inFx(i, "[data-drift]"),
        { y: (_, el) => Number(el.dataset.drift) * pose.drift * 0.5 },
        { y: (_, el) => -Number(el.dataset.drift) * pose.drift, duration: b - START[i] + 0.3 },
        START[i]
      )
      // Camera push-in only for drawn scenes: artwork/video is never magnified past what the screen needs (keeps it sharp).
      .to(camera, { scale: hasMedia(i) ? 1 : 1.06, duration: b - START[i] }, START[i])
      // Scene artwork: slow cinematic push-in and pan, driven by scroll.
      .fromTo(
        q(`[data-media="${i}"] [data-kenburns]`),
        { scale: 1, xPercent: 0.6, yPercent: 0.3 },
        { scale: 1.04, xPercent: -0.6, yPercent: -0.3, duration: b - START[i] + 0.4 },
        Math.max(0, START[i] - 0.1)
      )
      .fromTo(floatEl, { y: 0 }, { y: -14, duration: (b - START[i]) / 2, yoyo: true, repeat: 1, ease: "sine.inOut" }, START[i]);
  };

  // ----- ENTER: Samuel walks on, the design world assembles around him.
  tl.to(rig, { ...pose.scenes[0], autoAlpha: hasMedia(0) ? 0 : 1, duration: 0.45, ease: "power3.out" }, 0);
  showScene(0, 0.05);
  workScene(0);
  tl.to(
    inFx(0, "[data-cursor]"),
    { keyframes: { x: ["0em", "-9em", "-4em", "-12em"], y: ["0em", "6em", "14em", "9em"] }, duration: 0.6 },
    0.3
  );

  // ----- Transitions: the portrait itself carries the story from scene to scene.
  for (let i = 1; i < scenes.length; i += 1) {
    const from = HOLD_END[i - 1];
    hideScene(i - 1, from);
    tl.to(rig, { ...pose.scenes[i], duration: START[i] - from + 0.15, ease: "power2.inOut" }, from)
      .to(camera, { scale: 1, duration: START[i] - from, ease: "power1.inOut" }, from)
      // The portrait rig steps aside for scenes that have their own artwork.
      .to(rig, { autoAlpha: hasMedia(i) ? 0 : 1, duration: 0.2 }, START[i] - 0.1);
    showScene(i, START[i] - 0.05);
    workScene(i);
  }

  // Deploy specifics: lights come on, progress ring fills, counter runs, pipeline lights in order.
  const d = 2;
  const dA = START[d] + 0.25;
  const counter = { v: 0 };
  const countEl = stage.querySelector("[data-count]");
  tl.to(inFx(d, "[data-led]"), { autoAlpha: 1, duration: 0.05, stagger: { each: 0.008, from: "random" } }, dA)
    .to(inFx(d, "[data-ring]"), { strokeDashoffset: 0, duration: 0.6 }, dA)
    .to(counter, { v: 100, duration: 0.6, onUpdate: () => countEl && (countEl.textContent = `${Math.round(counter.v)}%`) }, dA)
    .to(inFx(d, "[data-step]"), { autoAlpha: 1, duration: 0.06, stagger: 0.15 }, dA + 0.05);

  // ----- FINALE: confident push-in, light sweep, fade to the closing line.
  const f = HOLD_END[3];
  hideScene(3, f + 0.05);
  tl.to(rig, { ...pose.finale, duration: 0.35, ease: "power2.out" }, f)
    .fromTo(q("[data-flash]"), { autoAlpha: 1, xPercent: -130 }, { xPercent: 130, duration: 0.3, ease: "power2.inOut" }, f + 0.02)
    .to(q("[data-flash]"), { autoAlpha: 0, duration: 0.05 }, f + 0.32)
    .to(rig, { autoAlpha: 0.22, duration: 0.25 }, f + 0.15)
    .to(q("[data-outro]"), { autoAlpha: 1, duration: 0.15 }, f + 0.18)
    .to(q("[data-outro-line]"), { yPercent: 0, duration: 0.2, stagger: 0.05, ease: "power3.out" }, f + 0.2)
    .set({}, {}, END);

  return tl;
}

/** Real portrait + four scene lights (rim tint masked to the photo's own silhouette). */
function Portrait({ className = "", withLights = true }) {
  const mask = {
    WebkitMaskImage: `url(${ME})`,
    maskImage: `url(${ME})`,
  };
  return (
    <div className={`relative ${className}`}>
      {withLights &&
        scenes.map((s, i) => (
          <div
            key={`glow-${s.id}`}
            data-light={i}
            className="ps-glow"
            style={{ background: `radial-gradient(closest-side, ${s.hues[0]}88, ${s.hues[1]}22 65%, transparent)` }}
          />
        ))}
      <img src={ME} alt="" className="ps-me" draggable="false" />
      {withLights &&
        scenes.map((s, i) => (
          <div
            key={`tint-${s.id}`}
            data-light={i}
            className="ps-tint"
            style={{ ...mask, background: `linear-gradient(100deg, ${s.hues[0]} 0%, transparent 38%, transparent 62%, ${s.hues[1]} 100%)` }}
          />
        ))}
    </div>
  );
}

export default function Story() {
  const pinRef = useRef(null);
  const stageRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      { desktop: `(min-width: 768px) and ${MOTION_OK}`, mobile: `(max-width: 767px) and ${MOTION_OK}` },
      (ctx) => {
        const { desktop, mobile } = ctx.conditions;
        if (!desktop && !mobile) return;
        buildTimeline(stageRef.current, pinRef.current, desktop ? "desktop" : "mobile");
      },
      stageRef
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="story" aria-label="How I work" className="relative">
      {/* ---------------- Cinematic version (motion allowed) ---------------- */}
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden bg-ink motion-reduce:hidden">
        <div ref={stageRef} className="absolute inset-0">
          <div data-camera className="absolute inset-0 origin-[60%_60%]">
            {/* Scene atmospheres */}
            {scenes.map((s, i) => (
              <div
                key={s.id}
                data-bg={i}
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(55% 60% at 68% 42%, ${s.hues[0]}55, transparent 70%),
                    radial-gradient(45% 50% at 20% 80%, ${s.hues[1]}33, transparent 70%)`,
                }}
              />
            ))}
            {/* AI scene artwork (only for scenes marked ready) */}
            {scenes.map((s, i) =>
              hasMedia(i) ? (
                // Phones: the artwork starts below the text panel so the face stays visible.
                <div key={`media-${s.id}`} data-media={i} aria-hidden="true" className="absolute inset-x-0 bottom-0 top-[34%] overflow-hidden md:top-0">
                  {/* Zoom toward the subject (focus point), not the frame centre. */}
                  <div data-kenburns className="h-full w-full" style={{ transformOrigin: s.media.focus ?? "center" }}>
                    <SceneMedia media={s.media} eager={i === 0} still />
                  </div>
                  {/* Darken the side where the text panel sits. */}
                  <div className={`absolute inset-0 ${i === 1 ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-ink/85 via-ink/25 to-transparent`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
                  <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ink to-transparent md:hidden" />
                </div>
              ) : null
            )}
            <div aria-hidden="true" className="ps-floor" />

            {/* The portrait rig: Samuel + lighting + scene effects, moved as one */}
            <div data-rig className="ps-rig" aria-hidden="true">
              {SCENE_FX.map(({ back: Back }, i) => (
                <div key={`back-${i}`} data-fx={i} className="ps-fx">
                  <Back />
                </div>
              ))}
              <div data-me-float className="absolute inset-0">
                <Portrait className="h-full w-full" />
              </div>
              <div className="ps-rig-fade" />
              {SCENE_FX.map(({ front: Front }, i) => (
                <div key={`front-${i}`} data-fx={i} className="ps-fx">
                  <Front />
                </div>
              ))}
            </div>
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
          <div data-flash aria-hidden="true" className="ps-flash" />

          {/* Text panels */}
          {scenes.map((scene, i) => (
            <div key={scene.id} className={`absolute left-4 right-4 top-[84px] md:top-auto md:w-[min(520px,38vw)] ${PANEL_POS[i]}`}>
              <div data-panel={i} className="glass rounded-3xl bg-ink/50 p-5 md:p-8">
                <p className="hud-label flex items-center gap-3 text-lime">
                  Step 0{i + 1} <span className="h-px w-8 bg-lime/60" aria-hidden="true" />
                </p>
                <h2 className="mt-3 overflow-hidden py-[0.06em] font-display text-[clamp(32px,5vw,76px)] font-black leading-[0.95] tracking-tight">
                  <span data-title className="block">
                    {scene.title}
                  </span>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">{scene.text}</p>
              </div>
            </div>
          ))}

          {/* Closing line */}
          <div data-outro className="absolute inset-0 grid place-items-center px-6 text-center">
            <div>
              <p className="overflow-hidden">
                <span data-outro-line className="hud-label block text-lime">
                  [ Design · Develop · Deploy · Deliver ]
                </span>
              </p>
              <p className="mt-4 overflow-hidden font-display text-[clamp(36px,7vw,110px)] font-black leading-[0.95] tracking-tight">
                <span data-outro-line className="block">
                  Let&apos;s build
                </span>
              </p>
              <p className="overflow-hidden font-display text-[clamp(36px,7vw,110px)] font-black leading-[0.95] tracking-tight text-lime">
                <span data-outro-line className="block">
                  what&apos;s next.
                </span>
              </p>
            </div>
          </div>

          <p aria-hidden="true" className="hud-label absolute bottom-24 right-16 hidden text-white/40 md:block">
            Scroll to advance ↓
          </p>
        </div>
      </div>

      {/* ---------------- Reduced-motion version: static, stacked ---------------- */}
      <div className="hidden bg-ink motion-reduce:block">
        {scenes.map((scene, i) => (
          <article key={scene.id} className="mx-auto grid max-w-6xl items-end gap-8 px-5 py-16 md:grid-cols-2 md:px-10">
            <div>
              <p className="hud-label text-lime">Step 0{i + 1}</p>
              <h2 className="mt-3 font-display text-[clamp(32px,5vw,64px)] font-black leading-[0.95]">{scene.title}</h2>
              <p className="mt-3 text-white/70">{scene.text}</p>
            </div>
            <div aria-hidden="true" className="relative mx-auto h-[46svh] w-full max-w-sm">
              <div
                className="absolute inset-0 rounded-full blur-3xl"
                style={{ background: `radial-gradient(closest-side, ${scene.hues[0]}66, transparent)` }}
              />
              {hasMedia(i) ? (
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <SceneMedia media={scene.media} still />
                </div>
              ) : (
                <Portrait className="h-full w-full" withLights={false} />
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
