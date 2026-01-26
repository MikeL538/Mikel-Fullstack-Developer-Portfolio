import { useEffect } from "react";

export default function ImageModal({
  project,
  onClose,
}: {
  project: any;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="imageModal" onClick={onClose}>
      <div
        className="imageModal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          className="imageModal__image"
          src={project.imageLarge}
          alt={project.title}
          onClick={onClose}
        />
      </div>
    </div>
  );
}
