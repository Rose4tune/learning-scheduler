import { Subject } from '@/entities/subject';

export interface Execution {
  id: string;
  date: string;
  startTime: string; // "HH:MM" 형식
  endTime: string;   // "HH:MM" 형식
  subject: Subject;
  memo?: string;
  achievement?: number; // 달성률 (0-100)
  
  // UI 렌더링용
  top: number;       // px
  height: number;    // px
}

export interface ExecutionCreateDTO {
  date: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  memo?: string;
  achievement?: number;
}

export interface ExecutionUpdateDTO {
  startTime?: string;
  endTime?: string;
  subjectId?: string;
  memo?: string;
  achievement?: number;
}
