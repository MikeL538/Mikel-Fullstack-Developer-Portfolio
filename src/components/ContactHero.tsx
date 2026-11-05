import { useTranslation } from "react-i18next";
import { profile } from "../config/profile";
import CopyEmail from "./CopyEmail";

export default function ContactHero() {
  const { t } = useTranslation();
  return (
    <div className="contact__container">
      <h1 className="contact__title">{t("contact.title")}</h1>
      <div className="contact__body">
        <p>{t("home.contactDescription")}</p>
        <a className="contact__email" href={profile.emailHref}>{profile.email}</a>
        <CopyEmail />
        <ul className="contact__channels">
          <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
          <li><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
          <li><a href={profile.phoneHref}>{profile.phoneDisplay}</a></li>
        </ul>
      </div>
    </div>
  );
}
