import React from 'react';
import { formatDuration } from '@/shared/lib';

interface StatsInfoProps {
  totalPlanMinutes: number;
  totalExecutionMinutes: number;
}

/**
 * 통계 정보 컴포넌트
 * - 계획/실행 시간, 달성률 표시
 * - 조건부 색상 (80% 이상: 초록, 50-80%: 노랑, 50% 미만: 빨강)
 */
export const StatsInfo: React.FC<StatsInfoProps> = ({
  totalPlanMinutes,
  totalExecutionMinutes,
}) => {
  const achievementRate =
    totalPlanMinutes > 0 ? Math.round((totalExecutionMinutes / totalPlanMinutes) * 100) : 0;

  const getAchievementColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1">
        <span className="text-gray-500">계획:</span>
        <span className="font-semibold text-blue-600">{formatDuration(totalPlanMinutes)}</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-gray-500">실행:</span>
        <span className="font-semibold text-green-600">
          {formatDuration(totalExecutionMinutes)}
        </span>
      </div>

      {totalPlanMinutes > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-gray-500">달성률:</span>
          <span className={`font-bold ${getAchievementColor(achievementRate)}`}>
            {achievementRate}%
          </span>
        </div>
      )}
    </div>
  );
};
