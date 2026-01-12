import React from 'react';
import { Execution } from './execution.model';

interface ExecutionBlockProps {
  execution: Execution;
  onMove?: (id: string, newStart: string) => void;
  onResize?: (id: string, newStart: string, newEnd: string) => void;
}

export const ExecutionBlock: React.FC<ExecutionBlockProps> = ({ execution, onMove, onResize }) => {
  return (
    <div
      className="absolute w-full px-2"
      style={{
        top: `${execution.top}px`,
        height: `${execution.height}px`,
      }}
    >
      <div
        className="h-full rounded border-l-4 px-3 py-2 cursor-move"
        style={{
          borderLeftColor: execution.subject.color,
          backgroundColor: `${execution.subject.color}30`,
        }}
      >
        <div className="text-sm font-medium text-gray-900">{execution.subject.name}</div>
        <div className="text-xs text-gray-600 mt-1">
          {execution.startTime} - {execution.endTime}
        </div>
        {execution.achievement !== undefined && (
          <div className="text-xs text-gray-500 mt-1">달성률: {execution.achievement}%</div>
        )}
      </div>
    </div>
  );
};
