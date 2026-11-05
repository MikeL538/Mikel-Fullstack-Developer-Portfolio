import { useLocalizedPath } from "../routing/useLocalizedPath";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { profile } from "../config/profile";
import ResponsiveImage from "./ResponsiveImage";

export default function HomeAbout() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();

  return (
    <section className="home__about" aria-labelledby="home-about-title">
      <div className="home__about__portrait">
        <ResponsiveImage source={profile.images.portrait} alt={t("accessibility.portrait", { name: profile.name })}
          loading="lazy" decoding="async" sizes="(max-width: 767px) 200px, 300px" />
      </div>
      <div>
        <p className="home__eyebrow">{t("about.title")}</p>
        <h2 id="home-about-title" className="home__section-title">{t("home.aboutTitle")}</h2>
        <p className="home__section-description">{t("home.aboutDescription")}</p>
        <Link className="home__text-link" to={localize("/about")}>{t("home.aboutMore")} <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
