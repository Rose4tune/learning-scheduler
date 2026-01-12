import { useState, useEffect } from 'react';
import { Plan } from '@/features/plan';
import { Execution } from '@/features/execution';
import { Subject } from '@/entities/subject';
import { DateEvent } from '@/entities/date-event';
import {
  fetchPlansByDate,
  fetchExecutionsByDate,
  fetchSubjects,
  fetchDateEventByDate,
  updatePlan as apiUpdatePlan,
  updateExecution as apiUpdateExecution,
  PlanDTO,
  ExecutionDTO,
} from '@/shared/api';
import { timeToPixel } from '@/shared/lib';

/**
 * 타임라인 데이터 로딩 및 변환 훅
 */
export const useTimelineData = (date: Date | string) => {
  // Date 객체를 YYYY-MM-DD 문자열로 변환
  const dateString = typeof date === 'string' 
    ? date 
    : date.toISOString().split('T')[0];
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [dateEvents, setDateEvents] = useState<DateEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 병렬로 데이터 로드
        const [subjectsData, plansData, executionsData, dateEventData] = await Promise.all([
          fetchSubjects(),
          fetchPlansByDate(dateString),
          fetchExecutionsByDate(dateString),
          fetchDateEventByDate(dateString),
        ]);

        setSubjects(subjectsData);
        // dateEvent를 배열로 변환 (복수 대표 일정 지원)
        setDateEvents(dateEventData ? [dateEventData] : []);

        // Subject ID로 매핑
        const subjectMap = new Map(subjectsData.map((s) => [s.id, s]));

        // Plan DTO → Plan 변환
        const transformedPlans = plansData.map((dto) =>
          transformPlanDTO(dto, subjectMap)
        );
        setPlans(transformedPlans);

        // Execution DTO → Execution 변환
        const transformedExecutions = executionsData.map((dto) =>
          transformExecutionDTO(dto, subjectMap)
        );
        setExecutions(transformedExecutions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading timeline data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dateString]);

  const updatePlan = async (id: string, updates: Partial<Pick<Plan, 'startTime' | 'endTime'>>) => {
    // 1. 로컬 상태 즉시 업데이트 (UI 반응성)
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== id) return plan;
        
        const newStartTime = updates.startTime ?? plan.startTime;
        const newEndTime = updates.endTime ?? plan.endTime;
        const top = timeToPixel(newStartTime);
        const endPixel = timeToPixel(newEndTime);
        const height = endPixel - top;

        return {
          ...plan,
          startTime: newStartTime,
          endTime: newEndTime,
          top,
          height,
        };
      })
    );

    // 2. Mock API 업데이트 (데이터 영속성)
    try {
      await apiUpdatePlan(id, updates);
    } catch (error) {
      console.error('Failed to update plan:', error);
      // TODO: 에러 처리 (롤백 또는 재시도)
    }
  };

  const updateExecution = async (id: string, updates: Partial<Pick<Execution, 'startTime' | 'endTime'>>) => {
    // 1. 로컬 상태 즉시 업데이트 (UI 반응성)
    setExecutions((prev) =>
      prev.map((execution) => {
        if (execution.id !== id) return execution;
        
        const newStartTime = updates.startTime ?? execution.startTime;
        const newEndTime = updates.endTime ?? execution.endTime;
        const top = timeToPixel(newStartTime);
        const endPixel = timeToPixel(newEndTime);
        const height = endPixel - top;

        return {
          ...execution,
          startTime: newStartTime,
          endTime: newEndTime,
          top,
          height,
        };
      })
    );

    // 2. Mock API 업데이트 (데이터 영속성)
    try {
      await apiUpdateExecution(id, updates);
    } catch (error) {
      console.error('Failed to update execution:', error);
      // TODO: 에러 처리 (롤백 또는 재시도)
    }
  };

  return {
    subjects,
    plans,
    executions,
    dateEvents,
    loading,
    error,
    updatePlan,
    updateExecution,
  };
};

/**
 * PlanDTO를 Plan으로 변환 (UI 렌더링용 픽셀 계산 포함)
 */
const transformPlanDTO = (dto: PlanDTO, subjectMap: Map<string, Subject>): Plan => {
  const subject = subjectMap.get(dto.subjectId);
  if (!subject) {
    throw new Error(`Subject not found: ${dto.subjectId}`);
  }

  const top = timeToPixel(dto.startTime);
  const endPixel = timeToPixel(dto.endTime);
  const height = endPixel - top;

  return {
    id: dto.id,
    date: dto.date,
    startTime: dto.startTime,
    endTime: dto.endTime,
    subject,
    memo: dto.memo,
    top,
    height,
  };
};

/**
 * ExecutionDTO를 Execution으로 변환
 */
const transformExecutionDTO = (
  dto: ExecutionDTO,
  subjectMap: Map<string, Subject>
): Execution => {
  const subject = subjectMap.get(dto.subjectId);
  if (!subject) {
    throw new Error(`Subject not found: ${dto.subjectId}`);
  }

  const top = timeToPixel(dto.startTime);
  const endPixel = timeToPixel(dto.endTime);
  const height = endPixel - top;

  return {
    id: dto.id,
    date: dto.date,
    startTime: dto.startTime,
    endTime: dto.endTime,
    subject,
    memo: dto.memo,
    achievement: dto.achievement,
    top,
    height,
  };
};
