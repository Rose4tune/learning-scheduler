import React from 'react';
import { DateEvent } from '@/shared/types';

interface DateEventChipProps {
  dateEvent: DateEvent | null;
}

/**
 * 대표 일정 Chip 컴포넌트
 * - 연한 파스텔 배경
 * - 둥근 모서리 (16px)
 * - 아이콘 + 텍스트
 */
export const DateEventChip: React.FC<DateEventChipProps> = ({ dateEvent }) => {
  if (!dateEvent) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>대표 일정 없음</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
        {dateEvent.icon && <span>{dateEvent.icon}</span>}
        <span>{dateEvent.title}</span>
      </div>
    </div>
  );
};
