import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from './Header';
import { Timeline } from '@/widgets/Timeline';

export const DayTimelinePage: React.FC = () => {
  const { date } = useParams<{ date?: string }>();
  const currentDate = date || new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header date={currentDate} />
      <Timeline date={currentDate} />
    </div>
  );
};
