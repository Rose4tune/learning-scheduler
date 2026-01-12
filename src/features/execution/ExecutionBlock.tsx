import React from 'react';
import { Execution } from './execution.model';
import { getMinutesDifference, formatDuration } from '@/shared/lib';

interface ExecutionBlockProps {
  execution: Execution;
  layout?: {
    left: number;
    width: number;
  };
  onMove?: (id: string, newStart: string) => void;
  onResize?: (id: string, newStart: string, newEnd: string) => void;
}

export const ExecutionBlock: React.FC<ExecutionBlockProps> = ({
  execution,
  layout,
  onMove,
  onResize,
}) => {
  const duration = getMinutesDifference(execution.startTime, execution.endTime);
  const isShort = execution.height < 60; // 1시간 미만

  // 달성률에 따른 배지 색상
  const getAchievementColor = (achievement?: number) => {
    if (achievement === undefined) return 'bg-gray-500';
    if (achievement >= 80) return 'bg-green-500';
    if (achievement >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 겹침 처리: layout이 있으면 적용
  const blockStyle = layout
    ? {
        top: `${execution.top}px`,
        height: `${execution.height}px`,
        left: `${layout.left}%`,
        width: `${layout.width}%`,
      }
    : {
        top: `${execution.top}px`,
        height: `${execution.height}px`,
        left: '0',
        width: '100%',
      };

  return (
    <div className="absolute px-2" style={blockStyle}>
      <div
        className="h-full rounded-md border-l-4 px-3 py-2 cursor-move hover:shadow-md transition-shadow overflow-hidden relative"
        style={{
          borderLeftColor: execution.subject.color,
          backgroundColor: `${execution.subject.color}25`,
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {execution.subject.icon && <span className="mr-1">{execution.subject.icon}</span>}
              {execution.subject.name}
            </div>
            {!isShort && (
              <div className="text-xs text-gray-600 mt-1">
                {execution.startTime} - {execution.endTime}
              </div>
            )}
            {!isShort && execution.memo && (
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                {execution.memo}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs font-medium text-gray-500 whitespace-nowrap">
              {formatDuration(duration)}
            </div>
            {execution.achievement !== undefined && (
              <span
                className={`text-xs text-white px-1.5 py-0.5 rounded ${getAchievementColor(
                  execution.achievement
                )}`}
              >
                {execution.achievement}%
              </span>
            )}
          </div>
        </div>
        {isShort && (
          <div className="text-xs text-gray-500 mt-0.5">
            {execution.startTime} - {execution.endTime}
          </div>
        )}
      </div>
    </div>
  );
};
