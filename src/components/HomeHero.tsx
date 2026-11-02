import { profile } from "../config/profile";
import { assetUrl } from "../utils/assetUrl";
import { useTranslation } from "react-i18next";

export default function HomeHero() {
  const { t } = useTranslation();

  return (
    <section className="home__hero">
      <h1 className="home__hero__title">{t("home.heroTitle")}</h1>
      <div className="home__hero__container">
        <div className="home__hero__info">
          <p className="home__hero-p">{t("home.heroP")} </p>
          <button
            className="home__hero__button"
            onClick={() => {
              document.getElementById("projects")?.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
              });
              document.getElementById("projects")?.focus({ preventScroll: true });
            }}
          >
            {t("home.heroButton")}
          </button>
        </div>
        <div className="home__hero__image-wrapper">
          <img
            className="home__hero__image"
            src={assetUrl(profile.images.hero)}
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
