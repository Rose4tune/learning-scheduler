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
  PlanDTO,
  ExecutionDTO,
} from '@/shared/api';
import { timeToPixel } from '@/shared/lib';

/**
 * 타임라인 데이터 로딩 및 변환 훅
 */
export const useTimelineData = (date: string) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [dateEvent, setDateEvent] = useState<DateEvent | null>(null);
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
          fetchPlansByDate(date),
          fetchExecutionsByDate(date),
          fetchDateEventByDate(date),
        ]);

        setSubjects(subjectsData);
        setDateEvent(dateEventData);

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
  }, [date]);

  return {
    subjects,
    plans,
    executions,
    dateEvent,
    loading,
    error,
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
