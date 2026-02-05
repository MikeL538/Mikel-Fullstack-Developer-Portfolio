import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    // Nagłówek strony
    <header id="header" className="header">
      <div className="header__container">
        {/* Lewa strona: Pic / nazwa */}
        <div className="header__logo">
          <img className="header__image" src="./" />
          <h3 className="header__name">Michał Lipiak</h3>
        </div>
        {/* Prawa strona: nawigacja */}
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
                Strona główna
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
                Projekty
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
                O mnie
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
                Kontakt
              </NavLink>
            </li>
            <li className="header__item">
              <NavLink
                to="/lang"
                className={({ isActive }) =>
                  isActive
                    ? "header__item header__item--active"
                    : "header__item"
                }
              >
                Lang
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      {/* Rainbow effect */}
      <svg
        className="header__curve"
        viewBox="0 0 1440 79"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
  );
}
