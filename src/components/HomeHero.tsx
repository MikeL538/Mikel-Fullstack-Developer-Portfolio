const BASE_URL = import.meta.env.BASE_URL;
import { useTranslation } from "react-i18next";

export default function HomeHero() {
  const { t } = useTranslation();

  return (
    <div className="home__hero">
      <h1 className="home__hero__title">{t("home.heroTitle")}</h1>
      <div className="home__hero__container">
        <div className="home__hero__info">
          <p className="home__hero-p">{t("home.heroP")} </p>
          <button
            className="home__hero__button"
            onClick={() => {
              document.getElementById("projects")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            {t("home.heroButton")}
          </button>
        </div>
        <div className="home__hero__image-wrapper">
          <img
            className="home__hero__image"
            src={BASE_URL + "images/HomeHeroImage.png"}
            alt="Hero image"
          />
        </div>
      </div>
    </div>
  );
}
