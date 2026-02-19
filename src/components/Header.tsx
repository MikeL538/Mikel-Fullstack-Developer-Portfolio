import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import icons from "../assets/icons.svg";

export default function Header() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight - 120;

      const isBottom = y >= max;
      console.log("SCROLL TRIGGER", y);
      setIsScrolled(y > 80 && !isBottom);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        id="header"
        className={`header ${isScrolled ? "scroll__header" : ""}`}
      >
        <div className="header__container">
          {/* Left side - pic + name */}
          <div className="header__logo">
            <a
              className="header__link"
              href="https://github.com/MikeL538"
              target="_blank"
            >
              <img className="header__image" src="images/MLHeader.png" />
              <h3 className="header__name">Michał Lipiak</h3>
            </a>
          </div>
          {/* Right side NAV */}
          <nav className="header__nav">
            <ul className="header__list">
              <li className="header__item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "header__item header__item--active"
                      : "header__item"
                  }
                >
                  {t("header.home")}
                </NavLink>
              </li>
              <li className="header__item">
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    isActive
                      ? "header__item header__item--active"
                      : "header__item"
                  }
                >
                  {t("header.projects")}
                </NavLink>
              </li>
              <li className="header__item">
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive
                      ? "header__item header__item--active"
                      : "header__item"
                  }
                >
                  {t("header.about")}
                </NavLink>
              </li>
              <li className="header__item">
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive
                      ? "header__item header__item--active"
                      : "header__item"
                  }
                >
                  {t("header.contact")}
                </NavLink>
              </li>
              <li className="header__item">
                {currentLang !== "pl" && (
                  <button
                    className="header__button"
                    onClick={() => i18n.changeLanguage("pl")}
                  >
                    <svg width={32} height={32}>
                      <use href={`${icons}#flag-pl`}></use>
                    </svg>
                  </button>
                )}
                {currentLang !== "en" && (
                  <button
                    className="header__button"
                    onClick={() => i18n.changeLanguage("en")}
                  >
                    <svg width={32} height={32}>
                      <use href={`${icons}#flag-uk`}></use>
                    </svg>
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Rainbow effect */}
        <svg
          className={`header__curve ${isScrolled ? "scroll__curve" : ""}`}
          viewBox="0 0 1440 79"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="headerGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgb(12, 15, 21)" />
              <stop offset="30%" stopColor="rgb(20, 24, 31)" />
              <stop offset="50%" stopColor="rgb(28, 32, 44)" />
              <stop offset="70%" stopColor="rgb(20, 24, 31)" />
              <stop offset="100%" stopColor="rgb(12, 15, 21)" />
            </linearGradient>
          </defs>

          <path
            d="M-100 79C-100 79 200 5 720 5C1240 5 1540 79 1540 79V0H-100V79Z"
            fill="url(#headerGradient)"
          />
        </svg>
      </header>
    </>
  );
}
