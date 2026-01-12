import React, { useState } from 'react';
import { Grid } from './Grid';
import { Column } from './Column';
import { useTimelineData } from '@/shared/hooks';

interface TimelineProps {
  date: Date | string;
}

export const Timeline: React.FC<TimelineProps> = ({ date }) => {
  const dateString = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  const { plans, executions, loading, error, subjects, updatePlan, updateExecution } = useTimelineData(date);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingBlock, setPendingBlock] = useState<{
    type: 'plan' | 'execution';
    startTime: string;
    endTime: string;
  } | null>(null);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
          <p className="text-red-600">데이터 로딩 오류: {error}</p>
        </div>
      </div>
    );
  }

  const handleCreatePlan = (startTime: string, endTime: string) => {
    console.log('새 계획 생성:', { startTime, endTime });
    // TODO: 실제 생성 모달 또는 API 호출
    setPendingBlock({ type: 'plan', startTime, endTime });
    setShowCreateModal(true);
  };

  const handleCreateExecution = (startTime: string, endTime: string) => {
    console.log('새 실행 생성:', { startTime, endTime });
    // TODO: 실제 생성 모달 또는 API 호출
    setPendingBlock({ type: 'execution', startTime, endTime });
    setShowCreateModal(true);
  };

  const handleUpdatePlan = (id: string, newStartTime: string, newEndTime: string) => {
    console.log('계획 업데이트:', { id, newStartTime, newEndTime });
    updatePlan(id, { startTime: newStartTime, endTime: newEndTime });
  };

  const handleUpdateExecution = (id: string, newStartTime: string, newEndTime: string) => {
    console.log('실행 업데이트:', { id, newStartTime, newEndTime });
    updateExecution(id, { startTime: newStartTime, endTime: newEndTime });
  };

  const handleSavePlan = (plan: any) => {
    console.log('계획 저장:', plan);
    updatePlan(plan.id, {
      startTime: plan.startTime,
      endTime: plan.endTime,
      subjectId: plan.subjectId,
      memo: plan.memo,
    });
  };

  const handleSaveExecution = (execution: any) => {
    console.log('실행 저장:', execution);
    updateExecution(execution.id, {
      startTime: execution.startTime,
      endTime: execution.endTime,
      subjectId: execution.subjectId,
      memo: execution.memo,
    });
  };

  const handleDeletePlan = (id: string) => {
    console.log('계획 삭제:', id);
    // TODO: 삭제 API 호출
  };

  const handleDeleteExecution = (id: string) => {
    console.log('실행 삭제:', id);
    // TODO: 삭제 API 호출
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_1fr] divide-x divide-gray-200">
          {/* 시간 그리드 */}
          <Grid />
          
          {/* Plan 컬럼 */}
          <Column
            type="plan"
            date={dateString}
            plans={plans}
            subjects={subjects}
            onCreateBlock={handleCreatePlan}
            onUpdateBlock={handleUpdatePlan}
            onSaveBlock={handleSavePlan}
            onDeleteBlock={handleDeletePlan}
          />
          
          {/* Execution 컬럼 */}
          <Column
            type="execution"
            date={dateString}
            executions={executions}
            subjects={subjects}
            onCreateBlock={handleCreateExecution}
            onUpdateBlock={handleUpdateExecution}
            onSaveBlock={handleSaveExecution}
            onDeleteBlock={handleDeleteExecution}
          />
        </div>
      </div>

      {/* 임시 알림 */}
      {showCreateModal && pendingBlock && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <p className="font-medium">
            {pendingBlock.type === 'plan' ? '계획' : '실행'} 블록 생성됨
          </p>
          <p className="text-sm mt-1">
            {pendingBlock.startTime} - {pendingBlock.endTime}
          </p>
          <button
            onClick={() => setShowCreateModal(false)}
            className="mt-2 text-xs underline"
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
};
