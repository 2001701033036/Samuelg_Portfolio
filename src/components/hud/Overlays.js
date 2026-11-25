/** Film grain + vignette over the whole page (non-interactive). */
export default function Overlays() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[35] overflow-hidden">
      <div className="noise absolute -inset-[50%] animate-grain opacity-[0.05]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}
