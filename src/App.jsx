import { useState } from 'react';
import { ChapterNav } from './components/ChapterNav';
import { CursorFollower } from './components/CursorFollower';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { useFerrariData } from './app/useFerrariData';
import { DriverSpotlight } from './sections/DriverSpotlight';
import { GallerySection } from './sections/GallerySection';
import { HeroSection } from './sections/HeroSection';
import { InsightsSection } from './sections/InsightsSection';
import { OverviewStats } from './sections/OverviewStats';
import { PerformanceChartSection } from './sections/PerformanceChartSection';
import { ResultsTableSection } from './sections/ResultsTableSection';
import { TeamIntro } from './sections/TeamIntro';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  const overviewState  = useFerrariData('/ferrari/overview');
  const driversState   = useFerrariData('/ferrari/drivers');
  const chartState     = useFerrariData('/ferrari/chart');
  const insightsState  = useFerrariData('/ferrari/insights');

  return (
    <>
      {/* Loading overlay — slides up on exit */}
      <LoadingScreen onDone={() => setLoaded(true)} />

      {/* Site content */}
      <div
        className="relative min-h-screen overflow-x-hidden bg-primary-black text-off-white"
        style={{ cursor: 'none' }}
      >
        <CursorFollower />
        <ChapterNav />
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
    </>
  );
}
