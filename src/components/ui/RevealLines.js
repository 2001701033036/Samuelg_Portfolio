import { useLayoutEffect, useRef } from "react";
import { gsap, MOTION_OK } from "../../lib/motion";

/** Big heading whose lines slide up from behind a mask when scrolled into view. */
export default function RevealLines({ lines, as: Tag = "h2", className = "" }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(ref.current.querySelectorAll("[data-line]"), {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-[0.06em]">
          <span data-line className="block">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
