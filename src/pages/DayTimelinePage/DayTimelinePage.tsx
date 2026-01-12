import React, { useState } from 'react';
import { Header } from './Header';
import { Timeline } from '@/widgets/Timeline';

/**
 * Day Timeline 페이지
 * - 날짜 상태 관리 (Task 7-2)
 * - 날짜 변경 시 타임라인 갱신
 */
export const DayTimelinePage: React.FC = () => {
  // 날짜 상태 관리
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // 날짜 변경 핸들러
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentDate={currentDate} onDateChange={handleDateChange} />
      <Timeline date={currentDate} />
    </div>
  );
};
