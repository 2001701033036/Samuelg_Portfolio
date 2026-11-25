import { person } from "../../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 pb-28 pt-8 md:px-10">
      <div className="hud-label mx-auto flex max-w-[1400px] flex-col justify-between gap-2 text-white/40 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {person.fullName}
        </p>
        <p>Designed & built by {person.fullName}</p>
      </div>
    </footer>
  );
}
