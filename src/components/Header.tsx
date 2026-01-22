import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    // Nagłówek strony
    <header className="header">
      <div className="header__container">
        {/* Lewa strona: Pic / nazwa */}
        <div className="header__logo">
          <img className="header__image" src="./" />
          Michał Lipiak
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
                Home
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
                Projects
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
                About
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
                Contact
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
            <stop offset="0%" stopColor="rgb(33, 37, 47)" />
            <stop offset="25%" stopColor="rgba(25,25,31,1)" />
            <stop offset="50%" stopColor="rgba(15,17,21,1)" />
            <stop offset="75%" stopColor="rgba(25,25,31,1)" />
            <stop offset="100%" stopColor="rgb(33, 37, 47)" />
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
