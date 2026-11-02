import { useEffect } from "react";

export function useCursorLight(): void {
  useEffect(() => {
    const enabled = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;
    const handleMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--x", `${x}px`);
        root.style.setProperty("--y", `${y}px`);
        frame = 0;
      });
    };
    const stop = () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frame);
      frame = 0;
      root.style.removeProperty("--x");
      root.style.removeProperty("--y");
    };
    const update = () => {
      stop();
      if (enabled.matches) window.addEventListener("mousemove", handleMove, { passive: true });
    };
    update();
    enabled.addEventListener("change", update);
    return () => {
      stop();
      enabled.removeEventListener("change", update);
    };
  }, []);
}
