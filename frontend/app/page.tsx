'use client';

import Script from 'next/script';
import { DashboardHeader } from '@/features/Overview/DashboardHeader/DashboardHeader';
import { OverviewSection } from '@/features/Overview/OverviewSection';
import { GraphSection } from '@/features/Overview/GraphSection/GraphSection';
import { AnalyticsSection } from '@/features/Analytics/AnalyticsSection';

// Set these in frontend/.env.local (see backend/app/scripts/create_api_key.py)
const TRACKER_API_URL = process.env.NEXT_PUBLIC_ZEPHYR_API_URL ?? 'http://127.0.0.1:8000/api/v1';
const TRACKER_API_KEY = process.env.NEXT_PUBLIC_ZEPHYR_API_KEY;

export default function Home() {
  const initializeTracker = () => {
    const Tracker = (window as any).ZephyrTracker; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!Tracker) return;
    if (!TRACKER_API_KEY) {
      console.warn('Zephyr tracker disabled: set NEXT_PUBLIC_ZEPHYR_API_KEY in frontend/.env.local');
      return;
    }

    (window as any).zephyrTrackerInstance = new Tracker({ // eslint-disable-line @typescript-eslint/no-explicit-any
      apiUrl: TRACKER_API_URL,
      apiKey: TRACKER_API_KEY,
      trackPageViews: true,
      trackClicks: true,
      sessionTimeout: 30,
      debug: true,
    });
  };

  return (
    <>
      <Script
        src="/zephyr-tracker.min.js"
        strategy="afterInteractive"
        onLoad={initializeTracker}
      />

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
