import React from 'react';

interface ColumnProps {
  type: 'plan' | 'execution';
  date: string;
}

export const Column: React.FC<ColumnProps> = ({ type, date }) => {
  const title = type === 'plan' ? '계획 (Plan)' : '실행 (Execution)';

  return (
    <div className="relative">
      {/* 컬럼 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>

      {/* 타임라인 영역 */}
      <div className="relative min-h-[2000px]">
        {/* 30분 단위 그리드 라인 */}
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full border-b border-gray-100"
            style={{ top: `${i * 40}px`, height: '40px' }}
          />
        ))}

        {/* 블록이 여기에 렌더링됨 */}
      </div>
    </div>
  );
};
