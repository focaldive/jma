import { HeroSection } from "@/components/home/hero-section";
import { Support } from "@/components/home/support";
import { Projects } from "@/components/home/projects";
import { GetInvolved } from "@/components/home/get-involved";
import { NewsEvents } from "@/components/home/news-events";
import AboutSection from "@/components/home/about-section";

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
