import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type IntroOverlayProps = {
  onDone: () => void;
  word?: string;
};

export default function IntroOverlay({
  onDone,
  word = "WELCOME",
}: IntroOverlayProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    const letters = Array.from(
      root.querySelectorAll<HTMLSpanElement>("[data-letter]"),
    );

    // scroll lock and hide scrollbar
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    // GSAP context = auto cleanup on unmount
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // scroll unlock
          html.style.overflow = previousHtmlOverflow;
          body.style.overflow = previousBodyOverflow;
          onDone();
        },
      });

      tl.to(letters, {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.06,
      })
        .to({}, { duration: 0.25 })
        .to(letters, {
          y: -40,
          opacity: 0,
          duration: 0.35,
          stagger: 0.03,
          ease: "power2.in",
        })
        .to(root, { opacity: 0, duration: 0.35 }, "<");
    }, root);

    return () => {
      ctx.revert();
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [onDone]);

  return (
    <div ref={rootRef} className="intro" aria-hidden="false">
      <div className="intro__word" aria-label={word}>
        {word.split("").map((ch, i) => (
          <span key={`${ch}-${i}`} data-letter className="intro__letter">
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}
