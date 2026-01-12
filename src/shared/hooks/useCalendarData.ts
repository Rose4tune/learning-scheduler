import { useState, useEffect } from 'react';
import { fetchPlansByDate, fetchExecutionsByDate } from '@/shared/api';

export interface DateStatus {
  hasPlans: boolean;
  hasExecutions: boolean;
}

export interface CalendarData {
  [dateString: string]: DateStatus; // 'YYYY-MM-DD' => { hasPlans, hasExecutions }
}

/**
 * 월별 캘린더 데이터 집계 훅
 * - 해당 월의 모든 날짜에 대해 계획/실행 데이터 존재 여부 반환
 */
export const useCalendarData = (year: number, month: number): CalendarData => {
  const [calendarData, setCalendarData] = useState<CalendarData>({});

  useEffect(() => {
    const loadCalendarData = async () => {
      // 해당 월의 첫날과 마지막날 계산
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      
      const data: CalendarData = {};

      // 월의 모든 날짜에 대해 데이터 확인
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        try {
          const [plans, executions] = await Promise.all([
            fetchPlansByDate(dateString),
            fetchExecutionsByDate(dateString),
          ]);

          data[dateString] = {
            hasPlans: plans.length > 0,
            hasExecutions: executions.length > 0,
          };
        } catch (error) {
          console.error(`Error loading data for ${dateString}:`, error);
          data[dateString] = {
            hasPlans: false,
            hasExecutions: false,
          };
        }
      }

      setCalendarData(data);
    };

    loadCalendarData();
  }, [year, month]);

  return calendarData;
};
