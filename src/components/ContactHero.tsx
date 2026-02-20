import { useTranslation } from "react-i18next";
import icons from "../assets/icons.svg";

export default function ContactHero() {
  const { t } = useTranslation();

  return (
    <>
      <div className="contact__container">
        <h2 className="contact__title">{t("contact.title")}</h2>
        <ul className="contact__list">
          <li className="contact__list--item">
            <a
              className="contact__link"
              href="https://github.com/MikeL538"
              target="_blank"
            >
              <svg className="contact__icon contact__icon--github">
                <use href={`${icons}#github`}></use>
              </svg>
              Github: https://github.com/MikeL538
            </a>
          </li>
          <li className="contact__list--item">
            <a
              className="contact__link"
              href="https://www.linkedin.com/in/michal-lipiak/"
              target="_blank"
            >
              <svg className="contact__icon contact__icon--linkedin">
                <use href={`${icons}#linkedin`}></use>
              </svg>
              Linkedin: https://www.linkedin.com/in/michal-lipiak/
            </a>
          </li>
          <li className="contact__list--item">
            <a
              className="contact__link"
              href="mailto: mikel538.work@gmail.com"
              target="_blank"
            >
              <svg className="contact__icon contact__icon--email">
                <use href={`${icons}#envelope`}></use>
              </svg>
              E-mail: mikel538.work@gmail.com
            </a>
          </li>
          <li className="contact__list--item">
            <a
              className="contact__link contact__icon--smartphone"
              href="tel: +48601598455"
              target="_blank"
            >
              <svg className="contact__icon">
                <use href={`${icons}#smartphone`}></use>
              </svg>
              Tel: (+48) 601 598 455
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
