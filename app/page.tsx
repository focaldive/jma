import { HeroSection } from "./components/hero-section";
import { Support } from "./components/support";
import { Projects } from "./components/projects";
import { GetInvolved } from "./components/get-involved";
import { NewsEvents } from "./components/news-events";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <NewsEvents />
      <GetInvolved />
      <Projects />
      <Support />
    </main>
  );
}
