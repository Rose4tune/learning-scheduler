import React, { useState } from 'react';
import { Grid } from './Grid';
import { Column } from './Column';
import { Plan } from '@/features/plan';
import { Execution } from '@/features/execution';
import { Subject } from '@/entities/subject';

interface TimelineProps {
  date: Date | string;
  plans: Plan[];
  executions: Execution[];
  subjects: Subject[];
  updatePlan: (id: string, updates: Partial<Pick<Plan, 'startTime' | 'endTime'>>) => void;
  updateExecution: (id: string, updates: Partial<Pick<Execution, 'startTime' | 'endTime'>>) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  date,
  plans,
  executions,
  subjects,
  updatePlan,
  updateExecution,
}) => {
  const dateString = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingBlock, setPendingBlock] = useState<{
    type: 'plan' | 'execution';
    startTime: string;
    endTime: string;
  } | null>(null);

  const handleCreatePlan = (subjectId: string, startTime: string, endTime: string, memo: string) => {
    console.log('새 계획 생성:', { subjectId, startTime, endTime, memo });
    // TODO: 실제 API 호출로 블록 생성
    setPendingBlock({ type: 'plan', startTime, endTime });
    setShowCreateModal(true);
  };

  const handleCreateExecution = (subjectId: string, startTime: string, endTime: string, memo: string) => {
    console.log('새 실행 생성:', { subjectId, startTime, endTime, memo });
    // TODO: 실제 API 호출로 블록 생성
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
