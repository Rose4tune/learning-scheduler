import React from 'react';
import { Plan } from './plan.model';

interface PlanBlockProps {
  plan: Plan;
  onMove?: (id: string, newStart: string) => void;
  onResize?: (id: string, newStart: string, newEnd: string) => void;
}

export const PlanBlock: React.FC<PlanBlockProps> = ({ plan, onMove, onResize }) => {
  return (
    <div
      className="absolute w-full px-2"
      style={{
        top: `${plan.top}px`,
        height: `${plan.height}px`,
      }}
    >
      <div
        className="h-full rounded border-l-4 px-3 py-2 cursor-move"
        style={{
          borderLeftColor: plan.subject.color,
          backgroundColor: `${plan.subject.color}20`,
        }}
      >
        <div className="text-sm font-medium text-gray-900">{plan.subject.name}</div>
        <div className="text-xs text-gray-600 mt-1">
          {plan.startTime} - {plan.endTime}
        </div>
      </div>
    </div>
  );
};
