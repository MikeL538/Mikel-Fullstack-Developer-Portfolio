import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="status-page">
      <p className="status-page__code">404</p>
      <h1>{t("errors.notFound.title")}</h1>
      <p>{t("errors.notFound.description")}</p>
      <Link to="/">{t("errors.backHome")}</Link>
    </section>
  );
}
