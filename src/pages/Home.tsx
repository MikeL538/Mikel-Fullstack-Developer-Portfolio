import HomeHero from "../components/HomeHero";
import HomeSkills from "../components/HomeSkills";
import HomeProjects from "../components/HomeProjects";

export default function Home() {
  return (
    <>
      <section className="home">
        <HomeHero />
        <HomeSkills />
        <HomeProjects />
      </section>
    </>
  );
}
