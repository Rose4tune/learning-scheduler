import React, { useRef, useState } from 'react';
import { Plan, PlanBlock } from '@/features/plan';
import { Execution, ExecutionBlock } from '@/features/execution';
import { useOverlapLayout } from '@/shared/hooks';
import { useCreate } from '@/features/schedule-edit';
import { useSnap } from '@/features/schedule-edit';
import { CreatePreview } from './CreatePreview';

interface ColumnProps {
  type: 'plan' | 'execution';
  date: string;
  plans?: Plan[];
  executions?: Execution[];
  onCreateBlock?: (startTime: string, endTime: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  type,
  date,
  plans = [],
  executions = [],
  onCreateBlock,
}) => {
  const title = type === 'plan' ? '계획 (Plan)' : '실행 (Execution)';
  const blocks = type === 'plan' ? plans : executions;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 겹침 처리된 레이아웃 계산
  const planLayouts = useOverlapLayout(plans);
  const executionLayouts = useOverlapLayout(executions);

  // 스냅 기능
  const { snapToGrid } = useSnap();

  // 블록 생성 훅
  const { isCreating, createStart, createEnd, startCreate, updateCreate, endCreate, cancelCreate } =
    useCreate({
      snapToGrid,
      onCreateEnd: (start, end) => {
        onCreateBlock?.(start, end);
      },
    });

  const handleMouseDown = (e: React.MouseEvent) => {
    // 빈 영역에서만 드래그 시작 (블록이 아닌 곳)
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('grid-line')) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setIsDragging(true);
        startCreate(e.clientY, rect.top);
      }
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isCreating) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        updateCreate(e.clientY, rect.top);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      endCreate();
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      cancelCreate();
    }
  };

  return (
    <div className="relative">
      {/* 컬럼 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{blocks.length}개</p>
      </div>

      {/* 타임라인 영역 */}
      <div
        ref={containerRef}
        className="relative min-h-[1920px] cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* 30분 단위 그리드 라인 (24시간 × 2 = 48개) */}
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full border-b border-gray-100 grid-line pointer-events-none"
            style={{ top: `${i * 40}px`, height: '40px' }}
          />
        ))}

        {/* 생성 중 미리보기 */}
        {isCreating && createStart && createEnd && (
          <CreatePreview startTime={createStart} endTime={createEnd} />
        )}

        {/* 블록 렌더링 (겹침 레이아웃 적용) */}
        {type === 'plan'
          ? planLayouts.map(({ block: plan, layout }) => (
              <PlanBlock key={plan.id} plan={plan} layout={layout} />
            ))
          : executionLayouts.map(({ block: execution, layout }) => (
              <ExecutionBlock key={execution.id} execution={execution} layout={layout} />
            ))}
      </div>
    </div>
  );
};
