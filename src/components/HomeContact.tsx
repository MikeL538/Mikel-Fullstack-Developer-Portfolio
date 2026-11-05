import { useLocalizedPath } from "../routing/useLocalizedPath";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { profile } from "../config/profile";

export default function HomeContact() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();

  return (
    <section className="home__contact" aria-labelledby="home-contact-title">
      <p className="home__eyebrow">{t("contact.title")}</p>
      <h2 id="home-contact-title" className="home__section-title">{t("home.contactTitle")}</h2>
      <p className="home__section-description">{t("home.contactDescription")}</p>
      <div className="home__actions">
        <a className="home__button" href={profile.emailHref}>{t("errors.contact")}</a>
        <Link className="home__button home__button--secondary" to={localize("/contact")}>{t("home.contactMore")}</Link>
      </div>
      <a className="home__text-link" href={profile.emailHref}>{profile.email}</a>
    </section>
  );
}
