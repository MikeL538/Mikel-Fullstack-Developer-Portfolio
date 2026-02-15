import { useTranslation } from "react-i18next";

export default function AboutHero() {
  const { t } = useTranslation();

  return (
    <>
      <div className="about__container">
        <h2 className="about__title">{t("about.title")}</h2>
        <p className="about__p">{t("about.p1")}</p>
        <p className="about__p">{t("about.p2")}</p>
        <p className="about__p">{t("about.p3")}</p>

        <h3 className="about__title--strenghts">{t("about.strengths")}</h3>
        <ul className="about__list">
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h4 className="about__list--item__title">
                {t("about.items.automation.title")}
              </h4>
            </div>
            <p className="about__list--item__p">
              {t("about.items.automation.description")}
            </p>
          </li>
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h4 className="about__list--item__title">
                {t("about.items.automation.title")}
              </h4>
            </div>
            <p className="about__list--item__p">
              {t("about.items.automation.description")}
            </p>
          </li>
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h4 className="about__list--item__title">
                {t("about.items.creativity.title")}
              </h4>
            </div>
            <p className="about__list--item__p">
              {t("about.items.creativity.description")}
            </p>
          </li>
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h4 className="about__list--item__title">
                {t("about.items.focus.title")}
              </h4>
            </div>
            <p className="about__list--item__p">
              {t("about.items.focus.description")}
            </p>
          </li>
        </ul>
      </div>
      <div className="about__img--container">
        <img className="about__img" src="./" alt="photo" />
        <div className="about__img--text">
          <h3 className="about__img--name">Michał Lipiak</h3>
          <h4 className="about__img--occ">{t("about.occ")}</h4>
        </div>
      </div>
    </>
  );
}
