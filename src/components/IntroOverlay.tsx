import { useId, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";

export default function IntroOverlay({ onDone, word }: {
  onDone: () => void;
  word: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      onDone();
    };
    const handleMotionChange = () => { if (reducedMotion.matches) finish(); };
    reducedMotion.addEventListener("change", handleMotionChange);

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });

    const ctx = gsap.context(() => {
      const letters = root.querySelectorAll<HTMLSpanElement>("[data-letter]");
      gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish })
        .to(letters, { yPercent: 0, opacity: 1, duration: 0.3, stagger: 0.05 })
        .to({}, { duration: 0.1 })
        .to(letters, { y: -450, opacity: 0, duration: 0.2, stagger: 0.025, ease: "power2.in" })
        .to(root, { opacity: 0, duration: 1 }, "<");
    }, root);
    handleMotionChange();

    return () => {
      ctx.revert();
      reducedMotion.removeEventListener("change", handleMotionChange);
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [onDone]);

  return (
    <div ref={rootRef} className="intro" role="dialog" aria-modal="true" aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key === "Escape") { event.preventDefault(); onDone(); }
        if (event.key === "Tab") { event.preventDefault(); skipRef.current?.focus(); }
      }}>
      <div id={titleId} className="intro__word" aria-label={word}>
        {Array.from(word).map((character, index) => (
          <span key={index} data-letter className="intro__letter" aria-hidden="true">{character}</span>
        ))}
      </div>
      <button ref={skipRef} type="button" className="intro__skip" onClick={onDone}>
        {t("accessibility.skipIntro")}
      </button>
    </div>
  );
}
