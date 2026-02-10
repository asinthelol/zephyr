'use client';

import { OverviewCard } from '@/shared/components/OverviewCard/OverviewCard';

export function OverviewSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <OverviewCard
        title="Unique Users"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
      />
      <OverviewCard
        title="Pageviews"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
      />
      <OverviewCard
        title="Sessions"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
      />
      <OverviewCard
        title="Pages per Session"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
      />
      <OverviewCard
        title="Bounce Rate"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
      />
      <OverviewCard
        title="Session Duration"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
      />
    </div>
  );
}
