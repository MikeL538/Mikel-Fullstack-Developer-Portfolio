export default function AboutHero() {
  return (
    <>
      <div className="about__container">
        <h2 className="about__title">O mnie</h2>
        <p className="about__p">
          Jestem fullstack developerem, tworzącym aplikacje, które działają
          sprawnie i są łatwe w utrzymaniu. Lubię budować nowe projekty i z
          każdą kolejną próbą udoskonalać swój kod.
        </p>

        <p className="about__p">
          Posiadam ugruntowaną wiedzę w JavaScript, TypeScript, SCSS, React i
          C++, a także w wielu innych technologiach i metodach. Skupiam się na
          tworzeniu intuicyjnych interfejsów i optymalizacji wydajności.
        </p>

        <p className="about__p">
          Dbam o czystą architekturę i nie boję się wracać do starszych
          projektów, aby je refaktoryzować i udoskonalać. Dzięki temu stale
          rozwijam swoje umiejętności i zdobywam doświadczenie w praktyce.
        </p>

        <h3 className="about__title--strenghts">Moje silne strony</h3>
        <ul className="about__list">
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h4 className="about__list--item__title">Automatyzacja pracy</h4>
            </div>
            <p className="about__list--item__p">
              potrafię tworzyć narzędzia i skrypty, które oszczędzają czas i
              minimalizują powtarzalne zadania.
            </p>
          </li>
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h4 className="about__list--item__title">
                Wytrwałość i cierpliwość
              </h4>
            </div>
            <p className="about__list--item__p">
              konsekwentnie doprowadzam projekty do końca, nawet przy trudnych
              wyzwaniach.
            </p>
          </li>
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h4 className="about__list--item__title">
                Kreatywność i pomysłowość
              </h4>
            </div>
            <p className="about__list--item__p">
              znajduję nietypowe rozwiązania dla złożonych problemów.
            </p>
          </li>
          <li className="about__list--item">
            <div className="about__list--item__container">
              <h4 className="about__list--item__title">
                Skupienie na efektach
              </h4>
            </div>
            <p className="about__list--item__p">
              realizuję pomysły w działających projektach, nie tylko na
              papierze.
            </p>
          </li>
        </ul>
      </div>
      <div className="about__img--container">
        <img className="about__img" src="" alt="photo" />
        <h3 className="about__img--name">Michał</h3>
        <h4 className="about__img--occ">Fullstack Developer</h4>
      </div>
    </>
  );
}
