import React, { useState, useRef, useEffect } from 'react';
import { useCalendarData } from '@/shared/hooks/useCalendarData';

interface CalendarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

/**
 * 캘린더 위젯 컴포넌트
 * - 월 선택 UI
 * - 날짜 그리드 (일~토)
 * - 데이터 있는 날짜 점 표시
 * - 외부 클릭 시 닫기
 */
export const Calendar: React.FC<CalendarProps> = ({ currentDate, onDateSelect, onClose }) => {
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth() + 1); // 1-12
  const calendarRef = useRef<HTMLDivElement>(null);

  // 월별 데이터 집계
  const calendarData = useCalendarData(viewYear, viewMonth);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // 이전 월
  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  // 다음 월
  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // 날짜 선택
  const handleDateClick = (day: number) => {
    const selectedDate = new Date(viewYear, viewMonth - 1, day);
    onDateSelect(selectedDate);
    onClose();
  };

  // 오늘 날짜 확인
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() + 1 &&
      viewYear === today.getFullYear()
    );
  };

  // 선택된 날짜 확인
  const isSelected = (day: number) => {
    return (
      day === currentDate.getDate() &&
      viewMonth === currentDate.getMonth() + 1 &&
      viewYear === currentDate.getFullYear()
    );
  };

  // 해당 월의 날짜 배열 생성
  const getDaysInMonth = () => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1);
    const lastDay = new Date(viewYear, viewMonth, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 (일요일) ~ 6 (토요일)

    const days: (number | null)[] = [];

    // 첫 주의 빈 칸
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 날짜
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const days = getDaysInMonth();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜별 데이터 점 표시
  const renderDataDots = (day: number) => {
    const dateString = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const status = calendarData[dateString];

    if (!status) return null;

    const { hasPlans, hasExecutions } = status;

    if (hasPlans && hasExecutions) {
      // 둘 다: 2색 점
      return (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
        </div>
      );
    } else if (hasPlans) {
      // 계획만: 파란 점
      return (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
        </div>
      );
    } else if (hasExecutions) {
      // 실행만: 초록 점
      return (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div
        ref={calendarRef}
        className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full"
      >
        {/* 월 선택 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="이전 월"
          >
            ◀
          </button>
          
          <h2 className="text-lg font-bold text-gray-900">
            {viewYear}년 {viewMonth}월
          </h2>
          
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="다음 월"
          >
            ▶
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day, index) => (
            <div
              key={day}
              className={`text-center text-sm font-semibold py-2 ${
                index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const today = isToday(day);
            const selected = isSelected(day);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`
                  relative aspect-square rounded-md text-sm font-medium transition-all
                  hover:bg-gray-100
                  ${today ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}
                  ${selected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                  ${index % 7 === 0 && !selected ? 'text-red-600' : ''}
                  ${index % 7 === 6 && !selected ? 'text-blue-600' : ''}
                `}
              >
                <span>{day}</span>
                {!selected && renderDataDots(day)}
              </button>
            );
          })}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => {
              const today = new Date();
              onDateSelect(today);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            오늘
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
