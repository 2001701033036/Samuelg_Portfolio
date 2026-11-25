import { useLayoutEffect, useRef } from "react";
import { FaPhoneAlt, FaRegAddressCard } from "react-icons/fa";
import { SiMinutemailer } from "react-icons/si";
import { TbWorldDownload } from "react-icons/tb";
import { contact, person, socials } from "../../data/content";
import { gsap, MOTION_OK } from "../../lib/motion";
import RevealLines from "../ui/RevealLines";

const channels = [
  { Icon: SiMinutemailer, label: "Email", value: person.email, href: `mailto:${person.email}` },
  { Icon: FaPhoneAlt, label: "Phone", value: person.phone, href: person.phoneHref },
  { Icon: FaRegAddressCard, label: "Location", value: person.location },
  { Icon: TbWorldDownload, label: "Resume", value: "Samuel-Resume", href: person.resume, external: true },
];

export default function Contact() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      MOTION_OK,
      () => {
        gsap.from("[data-channel]", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-channels]", start: "top 85%" },
        });
      },
      root
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="contact" ref={root} className="relative overflow-hidden pb-40 pt-28 md:pt-40">
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 -z-10 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-neon-violet/15 blur-[140px]" />
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="hud-label mb-5 text-lime">{contact.eyebrow}</p>
        <RevealLines lines={contact.heading} className="display text-[clamp(36px,8.6vw,150px)]" />
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md text-lg text-white/65">{contact.intro}</p>
          <a href={`mailto:${person.email}`} className="btn-lime self-start md:self-auto">
            <span className="h-2 w-2 rounded-full bg-ink" aria-hidden="true" />
            {contact.cta} <span aria-hidden="true">→</span>
          </a>
        </div>

        <ul data-channels className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ Icon, label, value, href, external }) => {
            const inner = (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-neon-cyan">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="hud-label block text-white/40">{label}</span>
                  <span className="mt-1 block break-words text-white/90">{value}</span>
                </span>
              </>
            );
            const cls = "glass flex items-center gap-4 rounded-2xl p-4";
            return (
              <li key={label} data-channel>
                {href ? (
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`${cls} focus-ring transition-colors hover:border-lime/50`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-3" aria-label="Social links">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring hud-label glass flex min-h-[44px] items-center gap-2 rounded-full px-4 text-white/80 transition-colors hover:text-lime"
              >
                <Icon size={16} aria-hidden="true" /> {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
