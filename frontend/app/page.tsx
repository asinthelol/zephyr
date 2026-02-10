'use client';

import { useState } from 'react';
import Script from 'next/script';
import { DashboardHeader } from '@/features/Overview/DashboardHeader/DashboardHeader';
import { OverviewSection } from '@/features/Overview/OverviewSection';
import { GraphSection } from '@/features/Overview/GraphSection/GraphSection';
import { AnalyticsSection } from '@/features/Analytics/AnalyticsSection';

export default function Home() {
  const [domain, setDomain] = useState('kevintolbert.dev');

  const initializeTracker = () => {
    if (typeof window !== 'undefined' && (window as any).ZephyrTracker) {
      console.log('Tracker script loaded - initializing');
      const tracker = new (window as any).ZephyrTracker({
        apiUrl: 'http://127.0.0.1:8000/api/v1',
        apiKey: '7e01951e560c7d4fc72c41baa4295c3e75c1420309c1353e9ef18fe471940274',
        trackPageViews: true,
        trackClicks: true,
        sessionTimeout: 30,
        debug: true,
      });

      (window as any).zephyrTrackerInstance = tracker;
      console.log('Tracker initialized:', tracker);
    }
  };

  return (
    <>
      <Script 
        src="/zephyr-tracker.min.js" 
        strategy="afterInteractive"
        onLoad={initializeTracker}
      />
       
      <div className="min-h-screen bg-[#1a1a1a]">
        <main className="container mx-auto px-6 py-6">
          <DashboardHeader domain={domain} onDomainChange={setDomain} />
          <OverviewSection />
          <GraphSection />
          <AnalyticsSection />
        </main>
      </div>
    </>
  );
}
