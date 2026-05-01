import Hero from "../sections/hero";
import Featured from "../sections/featured";
import Creative from "../sections/creative";
import SectionSlider from "../sections/SectionSlider";
import Experience from "../sections/experience";

export default function Home() {
  return (
    <SectionSlider>
      <Hero />
      <Featured />
      <Creative />
      <Experience />
    </SectionSlider>
  );
}
