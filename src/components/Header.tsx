import { Link, NavLink, useLocation } from "react-router-dom";
import { useLocalizedPath } from "../routing/useLocalizedPath";
import { localizedPath } from "../routing/paths";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import icons from "../assets/icons.svg";
import { profile } from "../config/profile";
import ResponsiveImage from "./ResponsiveImage";

export default function Header() {
  const { t, i18n } = useTranslation();
  const localize = useLocalizedPath();
  const currentLang = i18n.resolvedLanguage;
  const headerRef = useRef<HTMLElement>(null);
  const { pathname, search, hash } = useLocation();
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
            <NavLink
              className="header__link"
              to={localize("/")}
              end
            >
              <ResponsiveImage className="header__image" source={profile.images.header} alt="" />
              <span className="header__name">{profile.name}</span>
            </NavLink>
            <a className="header__github" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width={22} height={22} aria-hidden="true"><use href={`${icons}#github`} /></svg>
            </a>
          </div>
          {/* Right side NAV */}
          <nav className="header__nav" aria-label={t("accessibility.mainNavigation")}>
            <ul className="header__list">
              <li className="header__item">
                <NavLink
                  to={localize("/")}
                  end
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
                  to={localize("/projects")}
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
                  to={localize("/about")}
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
                  to={localize("/contact")}
                  className={({ isActive }) =>
                    isActive
                      ? "header__item header__item--active"
                      : "header__item"
                  }
                >
                  {t("header.contact")}
                </NavLink>
              </li>
              <li className="header__item header__languages">
                  <Link
                    className="header__button"
                    aria-label="Zmień język na polski"
                    lang="pl"
                    hrefLang="pl"
                    aria-current={currentLang === "pl" ? "true" : undefined}
                    to={localizedPath("pl", pathname) + search + hash}
                  >
                    PL
                  </Link>
                  <Link
                    className="header__button"
                    aria-label="Switch language to English"
                    lang="en"
                    hrefLang="en"
                    aria-current={currentLang === "en" ? "true" : undefined}
                    to={localizedPath("en", pathname) + search + hash}
                  >
                    EN
                  </Link>
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
