import Featured from "../sections/featured";
import Creative from "../sections/creative";
import SectionSlider from "../sections/SectionSlider";

export default function Home() {
  return (
    <SectionSlider>
      <Featured />
      <Creative />
    </SectionSlider>
  );
}
