import React from 'react';
import { Grid } from './Grid';
import { Column } from './Column';

interface TimelineProps {
  date: string;
}

export const Timeline: React.FC<TimelineProps> = ({ date }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_1fr] divide-x divide-gray-200">
          {/* 시간 그리드 */}
          <Grid />
          
          {/* Plan 컬럼 */}
          <Column type="plan" date={date} />
          
          {/* Execution 컬럼 */}
          <Column type="execution" date={date} />
        </div>
      </div>
    </div>
  );
};
