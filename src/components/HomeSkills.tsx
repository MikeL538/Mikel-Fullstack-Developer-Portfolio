import icons from "../assets/icons.svg";

export default function HomeSkills() {
  return (
    <section className="home__skills__container">
      <h2 className="home__skills__title">Skills</h2>
      <ul className="home__skills__list">
        {/* Front-end podstawy */}
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-html`} />
          </svg>
          HTML
        </li>
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-css`} />
          </svg>
          CSS / SASS
        </li>
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-js`} />
          </svg>
          JavaScript
        </li>
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-ts`} />
          </svg>
          TypeScript
        </li>
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-react`} />
          </svg>
          React
        </li>
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-vite`} />
          </svg>
          Vite
        </li>

        {/* Backend / fullstack */}
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-sql`} />
          </svg>
          SQL
        </li>
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-postgresql`} />
          </svg>
          PostgreSQL
        </li>
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-supabase`} />
          </svg>
          Supabase
        </li>
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-node.js`} />
          </svg>
          Node.js
        </li>

        {/* Version control */}
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-git`} />
          </svg>
          Git / Github
        </li>

        {/* Design */}
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-figma`} />
          </svg>
          Figma
        </li>

        {/* Opcjonalne / mniej istotne */}
        {/* <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-responsive-web-design`} />
          </svg>
          RWD
        </li>
        <li>
          <svg className="home__skills-image">
            <use href={`${icons}#icon-vscode`} />
          </svg>
          VS Code
        </li> */}
      </ul>
    </section>
  );
}
