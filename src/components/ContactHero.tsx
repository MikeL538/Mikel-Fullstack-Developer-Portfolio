import { useTranslation } from "react-i18next";
import icons from "../assets/icons.svg";
import { profile } from "../config/profile";

export default function ContactHero() {
  const { t } = useTranslation();

  return (
    <>
      <div className="contact__container">
        <h1 className="contact__title">{t("contact.title")}</h1>
        <ul className="contact__list">
          <li className="contact__list--item">
            <a
              className="contact__link"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg aria-hidden="true" className="contact__icon contact__icon--github">
                <use href={`${icons}#github`}></use>
              </svg>
              GitHub: {profile.github}
            </a>
          </li>
          <li className="contact__list--item">
            <a
              className="contact__link"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg aria-hidden="true" className="contact__icon contact__icon--linkedin">
                <use href={`${icons}#linkedin`}></use>
              </svg>
              LinkedIn: {profile.linkedin}
            </a>
          </li>
          <li className="contact__list--item">
            <a
              className="contact__link"
              href={profile.emailHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg aria-hidden="true" className="contact__icon contact__icon--email">
                <use href={`${icons}#envelope`}></use>
              </svg>
              E-mail: {profile.email}
            </a>
          </li>
          <li className="contact__list--item">
            <a
              className="contact__link contact__icon--smartphone"
              href={profile.phoneHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg aria-hidden="true" className="contact__icon">
                <use href={`${icons}#smartphone`}></use>
              </svg>
              Tel: {profile.phoneDisplay}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
