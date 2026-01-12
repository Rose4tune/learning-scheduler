import React, { useMemo } from 'react';
import { Execution } from './execution.model';
import { Plan } from '@/features/plan';
import { getMinutesDifference, formatDuration, timeToPixel } from '@/shared/lib';
import { ResizeHandle } from '@/features/schedule-edit';

interface ExecutionBlockProps {
  execution: Execution;
  plans?: Plan[]; // 달성률 계산을 위한 계획 목록
  layout?: {
    left: number;
    width: number;
  };
  tempTop?: number;
  tempTimes?: {startTime: string; endTime: string};
  isMoving?: boolean;
  isResizing?: boolean;
  onEdit?: (execution: Execution) => void;
  onMoveStart?: (id: string, startTime: string, endTime: string, clientY: number, blockTop: number) => void;
  onResizeStart?: (id: string, handle: 'top' | 'bottom', startTime: string, endTime: string) => void;
}

export const ExecutionBlock: React.FC<ExecutionBlockProps> = ({
  execution,
  plans = [],
  layout,
  tempTop,
  tempTimes,
  isMoving = false,
  isResizing = false,
  onEdit,
  onMoveStart,
  onResizeStart,
}) => {
  // 리사이즈 중이면 임시 시간 사용
  const startTime = tempTimes?.startTime ?? execution.startTime;
  const endTime = tempTimes?.endTime ?? execution.endTime;
  const duration = getMinutesDifference(startTime, endTime);
  
  // 리사이즈 중이면 임시 높이 계산
  const tempHeight = tempTimes ? timeToPixel(endTime) - timeToPixel(startTime) : execution.height;
  const tempTopCalc = tempTimes ? timeToPixel(startTime) : execution.top;
  
  const isShort = tempHeight < 60; // 1시간 미만

  /**
   * 달성률 계산 (실시간)
   * - 같은 날짜/과목의 계획 시간 대비 실행 시간
   * - 계획이 없으면 null 반환
   */
  const calculatedAchievement = useMemo(() => {
    // 같은 날짜/과목의 계획 찾기
    const matchingPlans = plans.filter(
      (plan) =>
        plan.date === execution.date &&
        plan.subject.id === execution.subject.id
    );

    if (matchingPlans.length === 0) {
      // 계획이 없으면 원본 achievement 사용
      return execution.achievement;
    }

    // 총 계획 시간 계산
    const totalPlanMinutes = matchingPlans.reduce(
      (sum, plan) => sum + getMinutesDifference(plan.startTime, plan.endTime),
      0
    );

    if (totalPlanMinutes === 0) {
      return execution.achievement;
    }

    // 실행 시간 (현재 시간 사용 - tempTimes 반영)
    const executionMinutes = duration;

    // 달성률 계산 (0-100%)
    const achievement = Math.min(100, Math.round((executionMinutes / totalPlanMinutes) * 100));
    
    return achievement;
  }, [plans, execution.date, execution.subject.id, execution.achievement, duration]);

  // 달성률에 따른 배지 색상
  const getAchievementColor = (achievement?: number) => {
    if (achievement === undefined) return 'bg-gray-500';
    if (achievement >= 80) return 'bg-green-500';
    if (achievement >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

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

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 편집 아이콘 클릭 - 편집 모달 표시
    e.stopPropagation();
    if (onEdit) {
      onEdit(execution);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 드래그 시작 - 부모 컴포넌트의 생성 이벤트 방지
    if (!isResizing && onMoveStart) {
      e.stopPropagation();
      onMoveStart(execution.id, execution.startTime, execution.endTime, e.clientY, execution.top);
    }
  };

  const handleResizeStart = (handle: 'top' | 'bottom') => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onResizeStart) {
      onResizeStart(execution.id, handle, execution.startTime, execution.endTime);
    }
  };

  return (
    <div
      className="absolute px-2 group"
      style={blockStyle}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`group h-full rounded-md border-l-4 px-3 py-2 cursor-move hover:shadow-md transition-shadow overflow-hidden relative select-none ${
          (isMoving || isResizing) ? 'opacity-70 shadow-lg' : ''
        }`}
        style={{
          borderLeftColor: execution.subject.color,
          backgroundColor: `${execution.subject.color}25`,
        }}
      >
        {/* 상단 리사이즈 핸들 */}
        <ResizeHandle position="top" onMouseDown={handleResizeStart('top')} />

        {/* 편집 아이콘 */}
        {onEdit && (
          <button
            onClick={handleEditClick}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded"
            title="편집"
          >
            <span className="text-sm">⚙️</span>
          </button>
        )}

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
            {calculatedAchievement !== undefined && (
              <span
                className={`text-xs text-white px-1.5 py-0.5 rounded ${getAchievementColor(
                  calculatedAchievement
                )}`}
              >
                {calculatedAchievement}%
              </span>
            )}
          </div>
        </div>
        {isShort && (
          <div className="text-xs text-gray-500 mt-0.5">
            {execution.startTime} - {execution.endTime}
          </div>
        )}

        {/* 하단 리사이즈 핸들 */}
        <ResizeHandle position="bottom" onMouseDown={handleResizeStart('bottom')} />
      </div>
    </div>
  );
};
