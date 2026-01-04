'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { AnalyticsItem } from '@/shared/components/AnalyticsCard/AnalyticsItem';
import { BrandIcon } from '@/shared/components/AnalyticsCard/BrandIcon';
import { CountryFlag } from '@/shared/components/AnalyticsCard/CountryFlag';
import { AnalyticsHeader } from '@/shared/components/AnalyticsCard/AnalyticsHeader';
import { OverviewCard } from '@/shared/components/OverviewCard/OverviewCard';
import { AnalyticsTabs } from '@/shared/components/AnalyticsCard/AnalyticsTabs';
import { AnalyticsCard } from '@/shared/components/AnalyticsCard/AnalyticsCard';
import { CalendarCard } from '@/shared/components/CalendarCard/CalendarCard';
import { FilterCard } from '@/shared/components/FilterCard/FilterCard';

export default function Home() {
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

      // Store tracker globally for button access
      (window as any).zephyrTrackerInstance = tracker;
      console.log('Tracker initialized:', tracker);
    }
  };

  const handleCustomEvent = () => {
    if (typeof window !== 'undefined' && (window as any).zephyrTrackerInstance) {
      const tracker = (window as any).zephyrTrackerInstance;
      
      tracker.track('button_click', {
        buttonName: 'Test Button',
        timestamp: new Date().toISOString(),
      });

      console.log('Custom event tracked!');
    }
  };

  return (
    <>
      <Script 
        src="/zephyr-tracker.min.js" 
        strategy="afterInteractive"
        onLoad={initializeTracker}
      />
       
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Zephyr Analytics Test Page
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Testing the tracker library integration
              </p>
            </div>

            {/* Info Cards */}
            <div className="flex flex-row justify-center mb-8">

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  Configuration
                </h2>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li><strong>API URL:</strong> 127.0.0.1:8000</li>
                  <li><strong>API Key:</strong> make your own :shrug:</li>
                  <li><strong>Debug Mode:</strong> Enabled</li>
                  <li><strong>Tracker Version:</strong> 1.0.0</li>
                </ul>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Test Custom Events
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Click the button below to trigger a custom event. Check the browser console 
                and network tab to see the tracking in action!
              </p>
              <button
                onClick={handleCustomEvent}
                className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
              >
                Track Custom Event
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                How to Test
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Open your browser&apos;s Developer Tools (F12)</li>
                <li>Go to the Console tab to see debug logs</li>
                <li>Go to the Network tab to see API requests</li>
                <li>Click around the page and the button above</li>
                <li>Watch the tracker send events to the backend</li>
              </ol>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
              <p>Navigate to different pages or perform actions to test the tracker</p>
              <p className="mt-2 text-sm">
                Backend should be running on <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">http://127.0.0.1:8000</code>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
