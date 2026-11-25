import { sections } from "../../data/content";
import { useHud } from "../../lib/hud";
import { scrollToId } from "../../lib/motion";

/** Right-edge vertical dot navigation. The active dot glows purple. */
export default function DotNav() {
  const { section } = useHud();

  return (
    <nav aria-label="Sections" className="fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 sm:block md:right-4">
      <ul className="flex flex-col gap-1">
        {sections.map(({ id, label }) => {
          const active = section === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(id);
                }}
                aria-label={`Go to ${label}`}
                aria-current={active ? "true" : undefined}
                className="focus-ring group relative grid h-8 w-8 place-items-center rounded-full"
              >
                <span
                  className={`block h-2 w-2 rounded-full transition-transform duration-300 ${
                    active
                      ? "scale-150 bg-neon-violet shadow-[0_0_12px_3px_rgba(139,92,246,.85)] ring-4 ring-neon-violet/25"
                      : "bg-white/30 group-hover:bg-white/70"
                  }`}
                />
                <span className="hud-label pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md bg-ink/80 px-2 py-1 text-white/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
