import { useFerrariData } from "./app/useFerrariData";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { DriverSpotlight } from "./sections/DriverSpotlight";
import { GallerySection } from "./sections/GallerySection";
import { HeroSection } from "./sections/HeroSection";
import { InsightsSection } from "./sections/InsightsSection";
import { OverviewStats } from "./sections/OverviewStats";
import { PerformanceChartSection } from "./sections/PerformanceChartSection";
import { ResultsTableSection } from "./sections/ResultsTableSection";
import { TeamIntro } from "./sections/TeamIntro";

export default function App() {
  const overviewState = useFerrariData("/ferrari/overview");
  const driversState = useFerrariData("/ferrari/drivers");
  const chartState = useFerrariData("/ferrari/chart");
  const insightsState = useFerrariData("/ferrari/insights");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white">
      <Navbar />
      <main>
        <HeroSection />
        <TeamIntro />
        <OverviewStats overviewState={overviewState} />
        <DriverSpotlight driversState={driversState} />
        <ResultsTableSection />
        <PerformanceChartSection chartState={chartState} />
        <InsightsSection insightsState={insightsState} />
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}
