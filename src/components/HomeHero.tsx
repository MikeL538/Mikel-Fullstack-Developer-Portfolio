const BASE_URL = import.meta.env.BASE_URL;

export default function HomeHero() {
  return (
    <>
      <section className="home__hero">
        <h1 className="home__hero__title">Fullstack Developer</h1>
        <div className="home__hero__container">
          <div className="home__hero__info">
            <p className="home__hero-p">
              Buduję nowoczesne aplikacje webowe w oparciu o technologie
              Frontendowe jak i Backendowe. Skupiam się na czystym kodzie,
              wydajności i tworzeniu rozwiązań, które realnie działają.
            </p>
            <button
              className="home__hero__button"
              onClick={() => {
                document.getElementById("projects")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Top projects
            </button>
          </div>
          <div className="home__hero__image-wrapper">
            <img
              className="home__hero__image"
              src={BASE_URL + "images/HomeHeroImage.png"}
              alt="Hero image"
            />
          </div>
        </div>
      </section>
    </>
  );
}
