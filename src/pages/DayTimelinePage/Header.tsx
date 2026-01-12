import React from 'react';
import { useTimelineData } from '@/shared/hooks';
import { getMinutesDifference, formatDuration } from '@/shared/lib';

interface HeaderProps {
  date: string;
}

export const Header: React.FC<HeaderProps> = ({ date }) => {
  const { dateEvent, plans, executions } = useTimelineData(date);

  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // 총 계획 시간 계산
  const totalPlanMinutes = plans.reduce((sum, plan) => {
    return sum + getMinutesDifference(plan.startTime, plan.endTime);
  }, 0);

  // 총 실행 시간 계산
  const totalExecutionMinutes = executions.reduce((sum, execution) => {
    return sum + getMinutesDifference(execution.startTime, execution.endTime);
  }, 0);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">{formattedDate}</h1>
        <div className="mt-2 flex items-center gap-6 text-sm text-gray-600">
          <span>
            대표 일정: {dateEvent ? dateEvent.title : '-'}
          </span>
          <span>
            계획: {formatDuration(totalPlanMinutes)}
          </span>
          <span>
            실행: {formatDuration(totalExecutionMinutes)}
          </span>
          {totalPlanMinutes > 0 && (
            <span className="font-medium text-blue-600">
              달성률: {Math.round((totalExecutionMinutes / totalPlanMinutes) * 100)}%
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
