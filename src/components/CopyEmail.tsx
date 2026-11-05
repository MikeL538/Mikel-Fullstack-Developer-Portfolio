import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { profile } from "../config/profile";

export default function CopyEmail() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "failed">("idle");
  const busy = useRef(false);

  async function copy() {
    if (busy.current) return;
    busy.current = true;
    setStatus("copying");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(profile.email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    } finally {
      busy.current = false;
    }
  }

  return (
    <div className="copy-email">
      <button type="button" onClick={copy} disabled={status === "copying"}>
        {t(status === "copying" ? "contact.copying" : "contact.copyEmail")}
      </button>
      <p role="status" aria-live="polite" aria-atomic="true">
        {status === "copied" ? t("contact.copied") : status === "failed" ? t("contact.copyFailed") : ""}
      </p>
    </div>
  );
}
