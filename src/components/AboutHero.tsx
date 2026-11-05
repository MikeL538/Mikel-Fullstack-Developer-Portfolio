import { useTranslation } from "react-i18next";
import { profile } from "../config/profile";
import ResponsiveImage from "./ResponsiveImage";

export default function AboutHero() {
  const { t } = useTranslation();

  return (
    <>
      <div className="about__img--container">
        <ResponsiveImage className="about__img" source={profile.images.portrait}
          alt={t("accessibility.portrait", { name: profile.name })}
          sizes="(max-width: 520px) calc(100vw - 12px), 500px" fetchPriority="high" />
        <div className="about__img--text">
          <p className="about__img--name">{profile.name}</p>
          <p className="about__img--occ">{t("about.occ")}</p>
        </div>
      </div>
      <div className="about__container">
        <h1 className="about__title">{t("about.title")}</h1>
        <p className="about__p">{t("about.p1")}</p>
        <p className="about__p">{t("about.p2")}</p>
        <p className="about__p">{t("about.p3")}</p>

        <h2 className="about__title--strenghts">{t("about.strengths")}</h2>
        <ul className="about__list">
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h3 className="about__list--item__title">
                {t("about.items.automation.title")}
              </h3>
            </div>
            <p className="about__list--item__p">
              {t("about.items.automation.description")}
            </p>
          </li>
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h3 className="about__list--item__title">
                {t("about.items.focus.title")}
              </h3>
            </div>
            <p className="about__list--item__p">
              {t("about.items.focus.description")}
            </p>
          </li>
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h3 className="about__list--item__title">
                {t("about.items.perseverance.title")}
              </h3>
            </div>
            <p className="about__list--item__p">
              {t("about.items.perseverance.description")}
            </p>
          </li>
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h3 className="about__list--item__title">
                {t("about.items.creativity.title")}
              </h3>
            </div>
            <p className="about__list--item__p">
              {t("about.items.creativity.description")}
            </p>
          </li>
        </ul>
      </div>
    </>
  );
}
