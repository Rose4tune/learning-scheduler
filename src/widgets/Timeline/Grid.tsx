import React from 'react';

export const Grid: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-gray-50 sticky left-0 z-20">
      {/* 헤더 공간 */}
      <div className="h-[52px] border-b border-gray-200 px-4 py-3">
        <h3 className="font-semibold text-gray-900 text-sm">시간</h3>
      </div>
      
      {/* 시간 레이블 (30분 단위 높이와 맞춤) */}
      {hours.map((hour) => (
        <div
          key={hour}
          className="h-20 px-4 py-2 text-sm text-gray-600 border-b border-gray-200 font-medium flex items-start"
        >
          {hour.toString().padStart(2, '0')}:00
        </div>
      ))}
    </div>
  );
};
