import { useEffect } from "react";
import { createPortal } from "react-dom";

const BASE_URL = import.meta.env.BASE_URL;

export default function ImageModal({
  project,
  onClose,
}: {
  project: any;
  onClose: () => void;
}) {
  useEffect(() => {
    const body = document.querySelector<HTMLBodyElement>("body");
    const html = document.documentElement;

    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    if (body) body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (body) body.style.overflow = "";
      html.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  return createPortal(
    <div className="imageModal" onClick={onClose}>
      <div
        className="imageModal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          className="imageModal__image"
          src={BASE_URL + project.imageLarge}
          alt={project.title}
          onClick={onClose}
        />
      </div>
    </div>,
    document.body,
  );
}
