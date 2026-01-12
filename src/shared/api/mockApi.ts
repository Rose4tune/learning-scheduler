/**
 * Mock API - JSON 파일에서 데이터 로드
 * 추후 실제 API로 교체 가능하도록 동일한 인터페이스 유지
 * 
 * NOTE: Mock 환경에서는 메모리 캐시를 사용하여 데이터를 관리합니다.
 * 페이지 새로고침 시 원본 JSON 데이터로 리셋됩니다.
 */

import { Subject } from '@/entities/subject';
import { DateEvent } from '@/entities/date-event';

// 메모리 캐시 (Mock 데이터 수정용)
let cachedData: MockData | null = null;

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
 * Mock 데이터 로드 (캐시 사용)
 */
export const fetchMockData = async (): Promise<MockData> => {
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch('/mock/data.json');
    if (!response.ok) {
      throw new Error('Failed to fetch mock data');
    }
    cachedData = await response.json();
    return cachedData;
  } catch (error) {
    console.error('Error loading mock data:', error);
    // 폴백 데이터 반환
    cachedData = {
      subjects: [],
      dateEvents: [],
      plans: [],
      executions: [],
    };
    return cachedData;
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

/**
 * 계획 업데이트
 * @param id 계획 ID
 * @param updates 업데이트할 필드 (시간, 과목, 메모 등)
 */
export const updatePlan = async (id: string, updates: Partial<Omit<PlanDTO, 'id'>>): Promise<PlanDTO> => {
  const data = await fetchMockData();
  const planIndex = data.plans.findIndex((plan) => plan.id === id);
  
  if (planIndex === -1) {
    throw new Error(`Plan not found: ${id}`);
  }

  // 데이터 업데이트
  data.plans[planIndex] = {
    ...data.plans[planIndex],
    ...updates,
  };

  console.log(`[Mock API] Plan updated:`, data.plans[planIndex]);
  return data.plans[planIndex];
};

/**
 * 실행 업데이트
 * @param id 실행 ID
 * @param updates 업데이트할 필드 (시간, 과목, 메모 등)
 */
export const updateExecution = async (id: string, updates: Partial<Omit<ExecutionDTO, 'id'>>): Promise<ExecutionDTO> => {
  const data = await fetchMockData();
  const executionIndex = data.executions.findIndex((execution) => execution.id === id);
  
  if (executionIndex === -1) {
    throw new Error(`Execution not found: ${id}`);
  }

  // 데이터 업데이트
  data.executions[executionIndex] = {
    ...data.executions[executionIndex],
    ...updates,
  };

  console.log(`[Mock API] Execution updated:`, data.executions[executionIndex]);
  return data.executions[executionIndex];
};

/**
 * 캐시 초기화 (테스트용)
 */
export const resetMockDataCache = () => {
  cachedData = null;
};
