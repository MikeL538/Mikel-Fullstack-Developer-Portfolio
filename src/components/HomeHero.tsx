import { useLocalizedPath } from "../routing/useLocalizedPath";
import { profile } from "../config/profile";
import ResponsiveImage from "./ResponsiveImage";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function HomeHero() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();

  return (
    <section className="home__hero" aria-labelledby="hero-title">
      <div className="home__hero__container">
        <div className="home__hero__info">
          <p className="home__eyebrow">{profile.name} <span>· {t("about.occ")}</span></p>
          <h1 id="hero-title" className="home__hero__title">{t("home.heroTitle")}</h1>
          <p className="home__hero-p">{t("home.heroP")} </p>
          <div className="home__actions">
            <button
              type="button"
              className="home__hero__button home__button"
              onClick={() => {
                const projectsHeading = document.getElementById("projects");
                projectsHeading?.scrollIntoView({
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
                });
                projectsHeading?.focus({ preventScroll: true });
              }}
            >
              {t("home.heroButton")}
            </button>
            <Link className="home__button home__button--secondary" to={localize("/contact")}>
              {t("home.contactButton")}
            </Link>
          </div>
        </div>
        <div className="home__hero__image-wrapper">
          <ResponsiveImage
            className="home__hero__image"
            source={profile.images.hero}
            alt=""
            sizes="(max-width: 767px) 340px, (max-width: 1224px) 42vw, 480px"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
