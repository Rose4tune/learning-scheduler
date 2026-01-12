import React from 'react';
import { timeToPixel } from '@/shared/lib';

interface CreatePreviewProps {
  startTime: string;
  endTime: string;
}

/**
 * 블록 생성 중 미리보기 표시
 */
export const CreatePreview: React.FC<CreatePreviewProps> = ({ startTime, endTime }) => {
  const [start, end] = startTime < endTime ? [startTime, endTime] : [endTime, startTime];
  
  const top = timeToPixel(start);
  const bottom = timeToPixel(end);
  const height = bottom - top;

  if (height < 10) return null; // 너무 작으면 표시 안 함

  return (
    <div
      className="absolute w-full px-2 pointer-events-none"
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
    >
      <div className="h-full rounded-md border-2 border-dashed border-blue-400 bg-blue-50 opacity-50 flex items-center justify-center">
        <span className="text-xs text-blue-600 font-medium">
          {start} - {end}
        </span>
      </div>
    </div>
  );
};
