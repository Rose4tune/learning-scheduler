import { Subject } from '@/entities/subject';

export interface Plan {
  id: string;
  date: string;
  startTime: string; // "HH:MM" 형식
  endTime: string;   // "HH:MM" 형식
  subject: Subject;
  memo?: string;
  
  // UI 렌더링용
  top: number;       // px
  height: number;    // px
}

export interface PlanCreateDTO {
  date: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  memo?: string;
}

export interface PlanUpdateDTO {
  startTime?: string;
  endTime?: string;
  subjectId?: string;
  memo?: string;
}
