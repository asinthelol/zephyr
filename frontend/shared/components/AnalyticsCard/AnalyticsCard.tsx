'use client';

import { useState } from 'react';
import { AnalyticsTabs } from './AnalyticsTabs';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsItem } from './AnalyticsItem';
import { AnalyticsCardProps } from './types';

export function AnalyticsCard({
  tabs,
  defaultTab,
  measurementLabel,
  tabData,
  onTabChange,
}: AnalyticsCardProps) {
  const [currentTab, setCurrentTab] = useState<string>(defaultTab || tabs[0]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  const currentTabData = tabData[currentTab] || { items: [], headerLabel: currentTab };

  return (
    <div className="w-[612px] h-[480px] bg-card-bg rounded-lg p-4 overflow-y-auto">

      {/* Tabs */}
      <div className="mb-4">
        <AnalyticsTabs
          tabs={tabs}
          defaultTab={defaultTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">

        {/* Header */}
        <AnalyticsHeader
          label={currentTabData.headerLabel || currentTab}
          measurementLabel={measurementLabel}
        />

        {/* Items */}
        <div className="flex flex-col gap-2">
          {currentTabData.items.map((item, index) => (
            <AnalyticsItem
              key={index}
              icon={item.icon}
              label={item.label}
              value={item.value}
              url={item.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
