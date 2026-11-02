import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import icons from "../assets/icons.svg";
import { profile } from "../config/profile";
import { assetUrl } from "../utils/assetUrl";

export default function Header() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  const headerRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const shouldCollapse = isScrolled && !hasFocus;

  useEffect(() => {
    const updateScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      const isNearBottom = y >= maxScroll - 120;
      setIsScrolled(y > 80 && !isNearBottom);
    };
    updateScroll();
    const frame = requestAnimationFrame(updateScroll);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const root = document.documentElement;
    const previousHeight = root.style.getPropertyValue("--header-height");
    const previousLogoHeight = root.style.getPropertyValue("--header-logo-height");
    const updateHeight = () => {
      root.style.setProperty("--header-height", `${header.getBoundingClientRect().height}px`);
      const logoHeight = header.querySelector(".header__logo")?.getBoundingClientRect().height ?? 0;
      root.style.setProperty("--header-logo-height", `${logoHeight}px`);
    };
    updateHeight();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateHeight) : undefined;
    observer?.observe(header);
    window.addEventListener("resize", updateHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateHeight);
      if (previousHeight) root.style.setProperty("--header-height", previousHeight);
      else root.style.removeProperty("--header-height");
      if (previousLogoHeight) root.style.setProperty("--header-logo-height", previousLogoHeight);
      else root.style.removeProperty("--header-logo-height");
    };
  }, []);

  return (
    <>
      <header
        id="header"
        className={`header ${shouldCollapse ? "scroll__header" : ""}`}
        ref={headerRef}
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
        }}
      >
        <div className="header__container">
          {/* Left side - pic + name */}
          <div className="header__logo">
            <a
              className="header__link"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="header__image" src={assetUrl(profile.images.header)} alt="" />
              <span className="header__name">{profile.name}</span>
            </a>
          </div>
          {/* Right side NAV */}
          <nav className="header__nav" aria-label={t("accessibility.mainNavigation")}>
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
                    type="button"
                    aria-label="Zmień język na polski"
                    lang="pl"
                    onClick={() => i18n.changeLanguage("pl")}
                  >
                    <svg width={32} height={32} aria-hidden="true">
                      <use href={`${icons}#flag-pl`}></use>
                    </svg>
                  </button>
                )}
                {currentLang !== "en" && (
                  <button
                    className="header__button"
                    type="button"
                    aria-label="Switch language to English"
                    lang="en"
                    onClick={() => i18n.changeLanguage("en")}
                  >
                    <svg width={32} height={32} aria-hidden="true">
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
          className={`header__curve ${shouldCollapse ? "scroll__curve" : ""}`}
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
