import React from 'react';

interface DateNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onCalendarClick: () => void;
}

/**
 * 날짜 네비게이션 컴포넌트 (Section 1)
 * - 화살표 버튼으로 날짜 이동
 * - 날짜 클릭 시 캘린더 표시
 */
export const DateNavigation: React.FC<DateNavigationProps> = ({
  currentDate,
  onDateChange,
  onCalendarClick,
}) => {
  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex items-center justify-center gap-2 py-4 bg-white border-b border-gray-200">
      {/* 오늘로 이동 */}
      <button
        onClick={handleToday}
        disabled={isToday(currentDate)}
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="오늘로 이동"
      >
        ◀◀
      </button>

      {/* 이전 날짜 */}
      <button
        onClick={handlePrevDay}
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        title="이전 날짜"
      >
        ◀
      </button>

      {/* 날짜 표시 + 캘린더 버튼 */}
      <button
        onClick={onCalendarClick}
        className="px-4 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors flex items-center gap-2"
        title="날짜 선택"
      >
        <span>{formatDate(currentDate)}</span>
        <span className="text-gray-500">📅</span>
      </button>

      {/* 다음 날짜 */}
      <button
        onClick={handleNextDay}
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        title="다음 날짜"
      >
        ▶
      </button>

      {/* 마지막 날짜 (현재는 비활성화) */}
      <button
        disabled
        className="px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
        title="마지막 날짜"
      >
        ▶▶
      </button>
    </div>
  );
};
