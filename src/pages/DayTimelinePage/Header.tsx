import React, { useState } from 'react';
import { useTimelineData } from '@/shared/hooks';
import { getMinutesDifference } from '@/shared/lib';
import { DateNavigation } from './DateNavigation';
import { DateEventChip } from './DateEventChip';
import { StatsInfo } from './StatsInfo';

interface HeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

/**
 * 헤더 컴포넌트 (2섹션 구조)
 * - Section 1: 날짜 네비게이션
 * - Section 2: 통계 정보 (대표 일정 + 계획/실행/달성률)
 */
export const Header: React.FC<HeaderProps> = ({ currentDate, onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  // 현재 날짜의 데이터 로드
  const { dateEvents, plans, executions } = useTimelineData(currentDate);

  // 대표 일정 (첫 번째 항목)
  const mainDateEvent = dateEvents.length > 0 ? dateEvents[0] : null;

  // 총 계획 시간 계산
  const totalPlanMinutes = plans.reduce((sum, plan) => {
    return sum + getMinutesDifference(plan.startTime, plan.endTime);
  }, 0);

  // 총 실행 시간 계산
  const totalExecutionMinutes = executions.reduce((sum, execution) => {
    return sum + getMinutesDifference(execution.startTime, execution.endTime);
  }, 0);

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
    // TODO: Phase 5에서 캘린더 위젯 구현
    console.log('캘린더 위젯 표시 (Phase 5에서 구현 예정)');
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Section 1: 날짜 네비게이션 */}
      <DateNavigation
        currentDate={currentDate}
        onDateChange={onDateChange}
        onCalendarClick={handleCalendarClick}
      />

      {/* Section 2: 통계 정보 영역 */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* 좌측: 대표 일정 Chip */}
          <DateEventChip dateEvent={mainDateEvent} />

          {/* 우측: 통계 정보 */}
          <StatsInfo
            totalPlanMinutes={totalPlanMinutes}
            totalExecutionMinutes={totalExecutionMinutes}
          />
        </div>
      </div>
    </header>
  );
};
