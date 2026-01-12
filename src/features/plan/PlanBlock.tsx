import React from 'react';
import { Plan } from './plan.model';
import { getMinutesDifference, formatDuration, timeToPixel } from '@/shared/lib';
import { ResizeHandle } from '@/features/schedule-edit';

interface PlanBlockProps {
  plan: Plan;
  layout?: {
    left: number;
    width: number;
  };
  tempTop?: number;
  tempTimes?: {startTime: string; endTime: string};
  isMoving?: boolean;
  isResizing?: boolean;
  onMoveStart?: (id: string, startTime: string, endTime: string, clientY: number, blockTop: number) => void;
  onResizeStart?: (id: string, handle: 'top' | 'bottom', startTime: string, endTime: string) => void;
}

export const PlanBlock: React.FC<PlanBlockProps> = ({ 
  plan, 
  layout,
  tempTop,
  tempTimes,
  isMoving = false, 
  isResizing = false,
  onMoveStart,
  onResizeStart,
}) => {
  // 리사이즈 중이면 임시 시간 사용
  const startTime = tempTimes?.startTime ?? plan.startTime;
  const endTime = tempTimes?.endTime ?? plan.endTime;
  const duration = getMinutesDifference(startTime, endTime);
  
  // 리사이즈 중이면 임시 높이 계산
  const tempHeight = tempTimes ? timeToPixel(endTime) - timeToPixel(startTime) : plan.height;
  const tempTopCalc = tempTimes ? timeToPixel(startTime) : plan.top;
  
  const isShort = tempHeight < 60; // 1시간 미만

  // 겹침 처리: layout이 있으면 적용, 드래그 중이면 tempTop 사용
  const top = tempTop !== undefined ? tempTop : tempTopCalc;
  const height = tempHeight;
  const blockStyle = layout
    ? {
        top: `${top}px`,
        height: `${height}px`,
        left: `${layout.left}%`,
        width: `${layout.width}%`,
      }
    : {
        top: `${top}px`,
        height: `${height}px`,
        left: '0',
        width: '100%',
      };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 드래그 시작 - 부모 컴포넌트의 생성 이벤트 방지
    if (!isResizing && onMoveStart) {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      onMoveStart(plan.id, plan.startTime, plan.endTime, e.clientY, plan.top);
    }
  };

  const handleResizeStart = (handle: 'top' | 'bottom') => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onResizeStart) {
      onResizeStart(plan.id, handle, plan.startTime, plan.endTime);
    }
  };

  return (
    <div
      className="absolute px-2 group"
      style={blockStyle}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`h-full rounded-md border-l-4 px-3 py-2 cursor-move hover:shadow-md transition-shadow overflow-hidden select-none relative ${
          (isMoving || isResizing) ? 'opacity-70 shadow-lg' : ''
        }`}
        style={{
          borderLeftColor: plan.subject.color,
          backgroundColor: `${plan.subject.color}15`,
        }}
      >
        {/* 상단 리사이즈 핸들 */}
        <ResizeHandle position="top" onMouseDown={handleResizeStart('top')} />

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

        {/* 하단 리사이즈 핸들 */}
        <ResizeHandle position="bottom" onMouseDown={handleResizeStart('bottom')} />
      </div>
    </div>
  );
};
