import React, { useRef, useState } from 'react';
import { Plan, PlanBlock } from '@/features/plan';
import { Execution, ExecutionBlock } from '@/features/execution';
import { Subject } from '@/entities/subject';
import { useOverlapLayout } from '@/shared/hooks';
import { useCreate, useMove, useResize, EditModal, CreateModal } from '@/features/schedule-edit';
import { useSnap } from '@/features/schedule-edit';
import { CreatePreview } from './CreatePreview';

interface ColumnProps {
  type: 'plan' | 'execution';
  date: string;
  plans?: Plan[];
  executions?: Execution[];
  subjects?: Subject[];
  onCreateBlock?: (subjectId: string, startTime: string, endTime: string, memo: string) => void;
  onUpdateBlock?: (id: string, newStartTime: string, newEndTime: string) => void;
  onSaveBlock?: (item: Plan | Execution) => void;
  onDeleteBlock?: (id: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  type,
  date,
  plans = [],
  executions = [],
  subjects = [],
  onCreateBlock,
  onUpdateBlock,
  onSaveBlock,
  onDeleteBlock,
}) => {
  const title = type === 'plan' ? '계획 (Plan)' : '실행 (Execution)';
  const blocks = type === 'plan' ? plans : executions;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMovingBlock, setIsMovingBlock] = useState(false);
  
  // 생성 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingTimeRange, setPendingTimeRange] = useState<{startTime: string; endTime: string} | null>(null);
  
  // 편집 모달 상태
  const [editingItem, setEditingItem] = useState<Plan | Execution | null>(null);

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
        // 드래그 완료 시 생성 모달 표시
        setPendingTimeRange({ startTime: start, endTime: end });
        setShowCreateModal(true);
      },
    });

  // 블록 이동 훅
  const { movingId, currentTop, startMove, updateMove, endMove, cancelMove } = useMove({
    snapToGrid,
    onMoveEnd: (id, newStartTime, newEndTime) => {
      onUpdateBlock?.(id, newStartTime, newEndTime);
      setIsMovingBlock(false);
    },
  });

  // 드래그 중인 블록의 임시 위치 저장
  const [movePreview, setMovePreview] = useState<{top: number; startTime: string; endTime: string} | null>(null);
  
  // 리사이즈 중인 블록의 임시 크기 저장
  const [resizePreview, setResizePreview] = useState<{startTime: string; endTime: string} | null>(null);
  const [isResizingBlock, setIsResizingBlock] = useState(false);

  // 블록 리사이즈 훅
  const { resizingId, resizeHandle, startResize, updateResize, endResize, cancelResize } = useResize({
    snapToGrid,
    onResizeEnd: (id, newStartTime, newEndTime) => {
      onUpdateBlock?.(id, newStartTime, newEndTime);
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
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (isResizingBlock && resizingId) {
      // 블록 리사이즈 중
      const result = updateResize(e.clientY, rect.top);
      if (result) {
        setResizePreview(result);
      }
    } else if (isMovingBlock && movingId) {
      // 블록 이동 중
      const result = updateMove(e.clientY);
      if (result) {
        setMovePreview(result);
      }
    } else if (isDragging && isCreating) {
      // 블록 생성 중
      updateCreate(e.clientY, rect.top);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isResizingBlock && resizingId) {
      // 블록 리사이즈 완료
      if (resizePreview) {
        endResize(resizePreview.startTime, resizePreview.endTime);
        setResizePreview(null);
      } else {
        cancelResize();
      }
      setIsResizingBlock(false);
    } else if (isMovingBlock && movingId) {
      // 블록 이동 완료
      if (movePreview) {
        endMove(movePreview.startTime, movePreview.endTime);
        setMovePreview(null);
      } else {
        cancelMove();
      }
      setIsMovingBlock(false);
    } else if (isDragging) {
      setIsDragging(false);
      endCreate();
    }
  };

  const handleMouseLeave = () => {
    if (isResizingBlock) {
      cancelResize();
      setIsResizingBlock(false);
      setResizePreview(null);
    } else if (isMovingBlock) {
      cancelMove();
      setIsMovingBlock(false);
      setMovePreview(null);
    } else if (isDragging) {
      setIsDragging(false);
      cancelCreate();
    }
  };

  // 블록 이동 시작 핸들러
  const handleBlockMoveStart = (
    id: string,
    startTime: string,
    endTime: string,
    clientY: number,
    blockTop: number
  ) => {
    setIsMovingBlock(true);
    startMove(id, startTime, endTime, clientY, blockTop);
  };

  // 블록 리사이즈 시작 핸들러
  const handleBlockResizeStart = (
    id: string,
    handle: 'top' | 'bottom',
    startTime: string,
    endTime: string
  ) => {
    setIsResizingBlock(true);
    startResize(id, handle, startTime, endTime);
  };

  // 블록 편집 핸들러
  const handleBlockEdit = (item: Plan | Execution) => {
    setEditingItem(item);
  };

  // 생성 모달에서 블록 생성
  const handleCreate = (subjectId: string, memo: string) => {
    if (pendingTimeRange) {
      onCreateBlock?.(subjectId, pendingTimeRange.startTime, pendingTimeRange.endTime, memo);
      setShowCreateModal(false);
      setPendingTimeRange(null);
    }
  };

  // 생성 모달 닫기
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setPendingTimeRange(null);
  };

  // 편집 모달 저장
  const handleSave = (updatedItem: Plan | Execution) => {
    onSaveBlock?.(updatedItem);
    setEditingItem(null);
  };

  // 편집 모달 삭제
  const handleDelete = () => {
    if (editingItem) {
      onDeleteBlock?.(editingItem.id);
      setEditingItem(null);
    }
  };

  // 편집 모달 닫기
  const handleCloseEditModal = () => {
    setEditingItem(null);
  };

  return (
    <div className="relative">
      {/* 컬럼 헤더 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-gray-900 whitespace-nowrap">{title}</h3>
          <p className="text-xs text-gray-500 whitespace-nowrap">{blocks.length}개</p>
        </div>
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
          ? planLayouts.map(({ block: plan, layout }) => {
              const isMovingThis = movingId === plan.id;
              const isResizingThis = resizingId === plan.id;
              const tempTop = isMovingThis && movePreview ? movePreview.top : undefined;
              const tempTimes = isResizingThis && resizePreview ? resizePreview : undefined;
              return (
                <PlanBlock
                  key={plan.id}
                  plan={plan}
                  layout={layout}
                  tempTop={tempTop}
                  tempTimes={tempTimes}
                  isMoving={isMovingThis}
                  isResizing={isResizingThis}
                  onEdit={handleBlockEdit}
                  onMoveStart={handleBlockMoveStart}
                  onResizeStart={handleBlockResizeStart}
                />
              );
            })
          : executionLayouts.map(({ block: execution, layout }) => {
              const isMovingThis = movingId === execution.id;
              const isResizingThis = resizingId === execution.id;
              const tempTop = isMovingThis && movePreview ? movePreview.top : undefined;
              const tempTimes = isResizingThis && resizePreview ? resizePreview : undefined;
              return (
                <ExecutionBlock
                  key={execution.id}
                  execution={execution}
                  layout={layout}
                  tempTop={tempTop}
                  tempTimes={tempTimes}
                  isMoving={isMovingThis}
                  isResizing={isResizingThis}
                  onEdit={handleBlockEdit}
                  onMoveStart={handleBlockMoveStart}
                  onResizeStart={handleBlockResizeStart}
                />
              );
            })}
      </div>

      {/* 생성 모달 */}
      {showCreateModal && pendingTimeRange && (
        <CreateModal
          type={type}
          startTime={pendingTimeRange.startTime}
          endTime={pendingTimeRange.endTime}
          subjects={subjects}
          onCreate={handleCreate}
          onClose={handleCloseCreateModal}
        />
      )}

      {/* 편집 모달 */}
      {editingItem && (
        <EditModal
          type={type}
          item={editingItem}
          subjects={subjects}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
};
