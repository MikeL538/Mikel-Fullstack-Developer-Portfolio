import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { Project } from "../types/project";
import { assetUrl } from "../utils/assetUrl";

export default function ImageModal({ project, onClose }: {
  project: Project | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!project || !dialog) return;
    const opener = document.activeElement;
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    // showModal makes the background inert and keeps keyboard focus in the dialog.
    dialog.showModal();
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      dialog.close();
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [project]);

  if (!project) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="imageModal"
      aria-labelledby={titleId}
      aria-modal="true"
      onKeyDown={(event) => {
        // The close button is the only focusable control in this image preview.
        if (event.key === "Tab") {
          event.preventDefault();
          closeRef.current?.focus();
        }
      }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="imageModal__container">
        <div className="imageModal__header">
          <h2 id={titleId}>{t("accessibility.previewTitle", { title: project.title })}</h2>
          <button ref={closeRef} type="button" className="imageModal__close" onClick={onClose}>
            {t("accessibility.closePreview")}
          </button>
        </div>
        <img className="imageModal__image" src={assetUrl(project.imageLarge)}
          alt={t("accessibility.projectImage", { title: project.title })} />
      </div>
    </dialog>,
    document.body,
  );
}
