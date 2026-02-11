'use client';

import { CalendarCard } from '@/shared/components/CalendarCard/CalendarCard';
import { Selector } from '@/shared/components/Selector/Selector';
import { useWebsiteConfig } from '@/shared/hooks/useWebsiteConfig';
import { useState } from 'react';
import { MdLanguage } from "react-icons/md";

export function DashboardHeader() {
  const { config, getCurrentDomain } = useWebsiteConfig();
  const [selectedDomain, setSelectedDomain] = useState(getCurrentDomain());

  const websiteOptions = config?.useDummyData
    ? [
        { value: 'example.com', label: 'example.com (Demo)' },
      ]
    : [
        { value: config?.domain || 'example.com', label: config?.domain || 'example.com' },
      ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-text-primary text-3xl font-bold">Dashboard</h1>
        
        {/* Domain Selector */}
        <Selector
          icon={<MdLanguage className="w-4 h-4 text-text-primary" />}
          label={selectedDomain}
          options={websiteOptions}
          selectedValue={selectedDomain}
          onSelect={setSelectedDomain}
          dropdownAlign="left"
          className="min-w-48"
          useDynamicLabel
        />
      </div>

      {/* Date Navigation */}
      <CalendarCard />
    </div>
  );
}