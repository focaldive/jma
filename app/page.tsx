import { HeroSection } from "./components/hero-section";
import { Support } from "./components/support";
import { Projects } from "./components/projects";
import { GetInvolved } from "./components/get-involved";
import { NewsEvents } from "./components/news-events";
import AboutSection from "./components/about-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <NewsEvents />
      <GetInvolved />
      <Projects />
      <Support />
    </main>
  );
}
