'use client';

import { OverviewCard } from '@/shared/components/OverviewCard/OverviewCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedCard, OverviewCardType } from '@/store/slices/overviewSlice';

export function OverviewSection() {
  const dispatch = useAppDispatch();
  const selectedCard = useAppSelector((state) => state.overview.selectedCard);

  const handleCardClick = (cardTitle: OverviewCardType) => {
    dispatch(setSelectedCard(cardTitle));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <OverviewCard
        title="Unique Users"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Unique Users'}
        onClick={() => handleCardClick('Unique Users')}
      />
      <OverviewCard
        title="Pageviews"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Pageviews'}
        onClick={() => handleCardClick('Pageviews')}
      />
      <OverviewCard
        title="Sessions"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Sessions'}
        onClick={() => handleCardClick('Sessions')}
      />
      <OverviewCard
        title="Pages per Session"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Pages per Session'}
        onClick={() => handleCardClick('Pages per Session')}
      />
      <OverviewCard
        title="Bounce Rate"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Bounce Rate'}
        onClick={() => handleCardClick('Bounce Rate')}
      />
      <OverviewCard
        title="Session Duration"
        value={727}
        change={{ value: 5.3, timeframe: 'vs yesterday' }}
        isSelected={selectedCard === 'Session Duration'}
        onClick={() => handleCardClick('Session Duration')}
      />
    </div>
  );
}
