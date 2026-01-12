import React from 'react';

interface HeaderProps {
  date: string;
}

export const Header: React.FC<HeaderProps> = ({ date }) => {
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">{formattedDate}</h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
          <span>대표 일정: -</span>
          <span>총 학습 시간: 0시간</span>
        </div>
      </div>
    </header>
  );
};
