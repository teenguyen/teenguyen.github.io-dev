import Hero from "../sections/hero";
import Featured from "../sections/featured";
import Creative from "../sections/creative";
import Experience from "../sections/experience";
import Footer from "../sections/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <Featured />
        <Creative />
        <Experience />
      </main>
      <Footer />
    </>
  );
}
