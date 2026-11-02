import { useTranslation } from "react-i18next";
import { profile } from "../config/profile";

export default function ErrorFallback() {
  const { t } = useTranslation();

  return (
    <main className="status-page" role="alert">
      <h1>{t("errors.render.title")}</h1>
      <p>{t("errors.render.description")}</p>
      <div className="status-page__actions">
        <button type="button" onClick={() => window.location.reload()}>
          {t("errors.reload")}
        </button>
        <a href={profile.emailHref}>{t("errors.contact")}</a>
      </div>
    </main>
  );
}
