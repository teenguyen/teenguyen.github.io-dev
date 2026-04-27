import Hero from "./sections/Hero";
import Featured from "./sections/Featured";
import SectionFlow from "./sections/SectionFlow";

export default function Home() {
  return (
    <SectionFlow>
      <Hero />
      <Featured />
    </SectionFlow>
  );
}
