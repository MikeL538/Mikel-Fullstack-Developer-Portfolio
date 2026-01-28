export default function HomeHero() {
  return (
    <>
      <section className="home__hero">
        <h1 className="home__hero__title">Aspiring Fullstack Developer</h1>
        <div className="home__hero__container">
          <p className="home__hero-p">
            Jestem aspirującym Fullstack Developerem, Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Rerum rem reprehenderit sunt fugiat
            repellendus ducimus! Dolorum corrupti, a perferendis necessitatibus
            hic, soluta cumque molestias excepturi quaerat repudiandae in
            aliquam itaque, distinctio fugit! Ipsum eos deserunt asperiores
          </p>
          <div className="home__hero__image-wrapper">
            <img
              className="home__hero__image"
              src="./public/images/HomeHeroImage.png"
            />
          </div>
        </div>
      </section>
    </>
  );
}
