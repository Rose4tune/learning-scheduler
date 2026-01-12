/**
 * Mock API - JSON 파일에서 데이터 로드
 * 추후 실제 API로 교체 가능하도록 동일한 인터페이스 유지
 */

import { Subject } from '@/entities/subject';
import { DateEvent } from '@/entities/date-event';

export interface PlanDTO {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  memo?: string;
}

export interface ExecutionDTO {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  memo?: string;
  achievement?: number;
  linkedPlanId?: string;
}

export interface MockData {
  subjects: Subject[];
  dateEvents: DateEvent[];
  plans: PlanDTO[];
  executions: ExecutionDTO[];
}

/**
 * Mock 데이터 로드
 */
export const fetchMockData = async (): Promise<MockData> => {
  try {
    const response = await fetch('/mock/data.json');
    if (!response.ok) {
      throw new Error('Failed to fetch mock data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading mock data:', error);
    // 폴백 데이터 반환
    return {
      subjects: [],
      dateEvents: [],
      plans: [],
      executions: [],
    };
  }
};

/**
 * 특정 날짜의 계획 조회
 */
export const fetchPlansByDate = async (date: string): Promise<PlanDTO[]> => {
  const data = await fetchMockData();
  return data.plans.filter((plan) => plan.date === date);
};

/**
 * 특정 날짜의 실행 조회
 */
export const fetchExecutionsByDate = async (date: string): Promise<ExecutionDTO[]> => {
  const data = await fetchMockData();
  return data.executions.filter((execution) => execution.date === date);
};

/**
 * 모든 과목 조회
 */
export const fetchSubjects = async (): Promise<Subject[]> => {
  const data = await fetchMockData();
  return data.subjects;
};

/**
 * 특정 날짜의 대표 일정 조회
 */
export const fetchDateEventByDate = async (date: string): Promise<DateEvent | null> => {
  const data = await fetchMockData();
  const event = data.dateEvents.find(
    (event) => event.date === date && event.isRepresentative
  );
  return event || null;
};
