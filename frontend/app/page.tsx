'use client';

import { DashboardHeader } from '@/features/Overview/DashboardHeader/DashboardHeader';
import { OverviewSection } from '@/features/Overview/OverviewSection';
import { GraphSection } from '@/features/Overview/GraphSection/GraphSection';
import { AnalyticsSection } from '@/features/Analytics/AnalyticsSection';

export default function Home() {
  return (
    <>

      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-6 py-6">
          <DashboardHeader />
          <OverviewSection />
          <GraphSection />
          <AnalyticsSection />
        </main>
      </div>
    </>
  );
}
