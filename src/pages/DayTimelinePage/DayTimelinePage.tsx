import React, { useState } from 'react';
import { Header } from './Header';
import { Timeline } from '@/widgets/Timeline';
import { useTimelineData } from '@/shared/hooks';

/**
 * Day Timeline 페이지
 * - 날짜 상태 관리 (Task 7-2)
 * - 날짜 변경 시 타임라인 갱신
 * - 상태 공유: Header와 Timeline이 동일한 데이터를 사용
 */
export const DayTimelinePage: React.FC = () => {
  // 날짜 상태 관리
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // 타임라인 데이터 로드 (Header와 Timeline이 공유)
  const {
    plans,
    executions,
    dateEvents,
    subjects,
    loading,
    error,
    updatePlan,
    updateExecution,
  } = useTimelineData(currentDate);

  // 날짜 변경 핸들러
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">데이터 로딩 오류: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentDate={currentDate}
        onDateChange={handleDateChange}
        dateEvents={dateEvents}
        plans={plans}
        executions={executions}
      />
      <Timeline
        date={currentDate}
        plans={plans}
        executions={executions}
        subjects={subjects}
        updatePlan={updatePlan}
        updateExecution={updateExecution}
      />
    </div>
  );
};
