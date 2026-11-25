import { useEffect, useRef } from "react";

const WINDOW_COLORS = ["rgba(34,211,238,", "rgba(167,139,250,", "rgba(212,255,58,", "rgba(244,114,182,"];

/** Procedural neon skyline drawn once per resize. Stands in for hero-city.webp. */
export default function CityPlaceholder() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let seed = 11;
      const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#07080c");
      sky.addColorStop(0.4, "#120d2e");
      sky.addColorStop(0.7, "#1c1550");
      sky.addColorStop(1, "#07080c");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const glow = (x, y, r, color) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      };
      glow(w * 0.68, h * 0.55, w * 0.5, "rgba(124,58,237,0.38)");
      glow(w * 0.18, h * 0.7, w * 0.35, "rgba(34,211,238,0.16)");
      glow(w * 0.9, h * 0.3, w * 0.25, "rgba(59,130,246,0.18)");

      const layers = [
        { ground: 0.66, maxH: 0.42, color: "#100f26", lit: 0.18, minW: 26, maxW: 70, alpha: 0.35 },
        { ground: 0.78, maxH: 0.45, color: "#0b0b1a", lit: 0.28, minW: 40, maxW: 100, alpha: 0.55 },
        { ground: 0.92, maxH: 0.5, color: "#06070e", lit: 0.38, minW: 60, maxW: 140, alpha: 0.8 },
      ];
      layers.forEach((L) => {
        let x = -10;
        while (x < w) {
          const bw = L.minW + rand() * (L.maxW - L.minW);
          const top = h * L.ground - h * (0.08 + rand() * L.maxH);
          ctx.fillStyle = L.color;
          ctx.fillRect(x, top, bw, h - top);
          // lit windows
          for (let wy = top + 8; wy < h * L.ground; wy += 9) {
            for (let wx = x + 5; wx < x + bw - 5; wx += 7) {
              if (rand() < L.lit * 0.35) {
                const c = WINDOW_COLORS[(rand() * WINDOW_COLORS.length) | 0];
                ctx.fillStyle = `${c}${(L.alpha * (0.4 + rand() * 0.6)).toFixed(2)})`;
                ctx.fillRect(wx, wy, 2, 3);
              }
            }
          }
          // occasional neon sign
          if (rand() < 0.12) {
            const c = WINDOW_COLORS[(rand() * WINDOW_COLORS.length) | 0];
            ctx.fillStyle = `${c}${L.alpha})`;
            ctx.fillRect(x + bw * 0.2, top + 12 + rand() * 40, bw * 0.5, 3);
          }
          x += bw + rand() * 6;
        }
      });

      const fog = ctx.createLinearGradient(0, h * 0.55, 0, h);
      fog.addColorStop(0, "rgba(7,8,12,0)");
      fog.addColorStop(1, "rgba(7,8,12,0.95)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, w, h);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="h-full w-full" />;
}
