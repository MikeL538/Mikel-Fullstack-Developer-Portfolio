import { profile } from "../config/profile";
import { assetUrl } from "../utils/assetUrl";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function HomeHero() {
  const { t } = useTranslation();

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
            <Link className="home__button home__button--secondary" to="/contact">
              {t("home.contactButton")}
            </Link>
          </div>
        </div>
        <div className="home__hero__image-wrapper">
          <img
            className="home__hero__image"
            src={assetUrl(profile.images.hero)}
            alt=""
            width={622}
            height={403}
          />
        </div>
      </div>
    </section>
  );
}
