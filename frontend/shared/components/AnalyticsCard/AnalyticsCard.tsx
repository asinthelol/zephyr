'use client';

import { useState } from 'react';
import { AnalyticsTabs } from './AnalyticsTabs';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsItem } from './AnalyticsItem';
import { AnalyticsCardProps } from '@/shared/components/types';

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

  // Total value of all items in the current tab, used for calculating percentage for background fill
  const totalValue = currentTabData.items.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="w-full h-120 bg-card-bg rounded-lg p-4 overflow-y-auto">

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
          {currentTabData.items.map((item, index) => {
            const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
            
            return (
              <AnalyticsItem
                key={index}
                icon={item.icon}
                label={item.label}
                value={item.value}
                url={item.url}
                percentage={percentage}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}