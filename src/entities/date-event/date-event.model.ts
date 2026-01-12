export interface DateEvent {
  id: string;
  date: string; // "YYYY-MM-DD" 형식
  title: string;
  description?: string;
  isRepresentative: boolean; // 대표 일정 여부
  createdAt: string;
  updatedAt: string;
}

export interface DateEventCreateDTO {
  date: string;
  title: string;
  description?: string;
  isRepresentative?: boolean;
}

export interface DateEventUpdateDTO {
  title?: string;
  description?: string;
  isRepresentative?: boolean;
}
