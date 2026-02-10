'use client';

import { CalendarCard } from '@/shared/components/CalendarCard/CalendarCard';
import { Selector } from '@/shared/components/Selector/Selector';
import { useState } from 'react';
import { MdLanguage } from "react-icons/md";

export function DashboardHeader() {

  const [domainName, setDomainName] = useState('example.com');

  return (
    <div className="flex items-center justify-between mb-6">

      {/* Domain Selector */}
      <Selector
        icon={
          <MdLanguage className="w-4 h-4 text-text-primary" />
        }
        label={domainName}
        options={[
          { value: 'example.com', label: 'example.com' },
          { value: 'example.org', label: 'example.org' },
          { value: 'example.net', label: 'example.net' },
        ]}
        selectedValue={domainName}
        onSelect={(value) => setDomainName(value)}
        dropdownAlign='left'
        className="min-w-40"
      />
      
      {/* Date Navigation */}
      <CalendarCard />
    </div>
  );
}
