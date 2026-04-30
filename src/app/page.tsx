import Hero from "../sections/hero";
import Featured from "../sections/featured";
import SectionFlow from "../sections/SectionFlow";
import Creative from "../sections/creative";

export default function Home() {
  return (
    <SectionFlow>
      <Hero />
      <Featured />
      <Creative />
    </SectionFlow>
  );
}
