/**
 * 공통 타입 정의
 */

export type DateString = string; // "YYYY-MM-DD" 형식
export type TimeString = string; // "HH:MM" 형식
export type ISODateString = string; // ISO 8601 형식

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}
