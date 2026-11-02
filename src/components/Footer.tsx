import { profile } from "../config/profile";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Sekcja informacji o prawach autorskich */}
        <div className="footer__copyright">
          © {new Date().getFullYear()} {profile.copyrightName}. All rights
          reserved.
        </div>

        {/* Sekcja linków społecznościowych */}
        <div className="footer__socials">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            LinkedIn
          </a>
          {/* <a
            href="https://twitter.com/mikel"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            WhatsApp
          </a> */}
          <a
            href={profile.emailHref}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            E-mail
          </a>
        </div>
      </div>
      {/* Rainbow effect */}
      <svg
        className="footer__curve"
        viewBox="0 0 1440 79"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(12, 15, 21)" />
            <stop offset="30%" stopColor="rgb(20, 24, 31)" />
            <stop offset="50%" stopColor="rgb(28, 32, 44)" />
            <stop offset="70%" stopColor="rgb(20, 24, 31)" />
            <stop offset="100%" stopColor="rgb(12, 15, 21)" />
          </linearGradient>
        </defs>

        <path
          d="M-100 79C-100 79 200 5 720 5C1240 5 1540 79 1540 79V0H-100V79Z"
          fill="url(#footerGradient)"
        />
      </svg>
    </footer>
  );
}
