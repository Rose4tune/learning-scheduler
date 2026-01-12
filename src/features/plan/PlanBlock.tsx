import React from 'react';
import { Plan } from './plan.model';
import { getMinutesDifference, formatDuration } from '@/shared/lib';

interface PlanBlockProps {
  plan: Plan;
  layout?: {
    left: number;
    width: number;
  };
  onMove?: (id: string, newStart: string) => void;
  onResize?: (id: string, newStart: string, newEnd: string) => void;
}

export const PlanBlock: React.FC<PlanBlockProps> = ({ plan, layout, onMove, onResize }) => {
  const duration = getMinutesDifference(plan.startTime, plan.endTime);
  const isShort = plan.height < 60; // 1시간 미만

  // 겹침 처리: layout이 있으면 적용
  const blockStyle = layout
    ? {
        top: `${plan.top}px`,
        height: `${plan.height}px`,
        left: `${layout.left}%`,
        width: `${layout.width}%`,
      }
    : {
        top: `${plan.top}px`,
        height: `${plan.height}px`,
        left: '0',
        width: '100%',
      };

  return (
    <div className="absolute px-2" style={blockStyle}>
      <div
        className="h-full rounded-md border-l-4 px-3 py-2 cursor-move hover:shadow-md transition-shadow overflow-hidden"
        style={{
          borderLeftColor: plan.subject.color,
          backgroundColor: `${plan.subject.color}15`,
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {plan.subject.icon && <span className="mr-1">{plan.subject.icon}</span>}
              {plan.subject.name}
            </div>
            {!isShort && (
              <div className="text-xs text-gray-600 mt-1">
                {plan.startTime} - {plan.endTime}
              </div>
            )}
            {!isShort && plan.memo && (
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                {plan.memo}
              </div>
            )}
          </div>
          <div className="text-xs font-medium text-gray-500 whitespace-nowrap">
            {formatDuration(duration)}
          </div>
        </div>
        {isShort && (
          <div className="text-xs text-gray-500 mt-0.5">
            {plan.startTime} - {plan.endTime}
          </div>
        )}
      </div>
    </div>
  );
};
