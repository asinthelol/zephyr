'use client';

import { useState } from 'react';
import { AnalyticsTabsProps } from './types';

export function AnalyticsTabs({ tabs, onTabChange, defaultTab }: AnalyticsTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="flex items-start gap-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className="flex flex-col gap-0.5 cursor-pointer border-0 bg-transparent p-0"
        >
          <span
            className={`font-inter font-medium text-base leading-[19px] transition-all ${
              activeTab === tab
                ? 'text-text-primary'
                : 'text-text-muted hover:opacity-75'
            }`}
          >
            {tab}
          </span>

          {/* Underline for active tab */}
          {activeTab === tab && (
            <div className="w-full h-0.5 bg-text-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
