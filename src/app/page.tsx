import Hero from "../sections/hero";
import Featured from "../sections/featured";
import SectionFlow from "../sections/SectionFlow";

export default function Home() {
  return (
    <SectionFlow>
      <Hero />
      <Featured />
    </SectionFlow>
  );
}
