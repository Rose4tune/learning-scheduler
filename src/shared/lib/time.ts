/**
 * 시간 계산 유틸리티 함수들
 */

const PIXEL_PER_HOUR = 80; // 1시간 = 80px
const PIXEL_PER_MINUTE = PIXEL_PER_HOUR / 60;

/**
 * "HH:MM" 형식의 시간을 픽셀로 변환
 */
export const timeToPixel = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes * PIXEL_PER_MINUTE;
};

/**
 * 픽셀을 "HH:MM" 형식의 시간으로 변환
 */
export const pixelToTime = (pixel: number): string => {
  const totalMinutes = Math.round(pixel / PIXEL_PER_MINUTE);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * 두 시간 사이의 분 차이 계산
 */
export const getMinutesDifference = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  return endTotalMinutes - startTotalMinutes;
};

/**
 * 분을 "H시간 M분" 형식으로 변환
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
};

/**
 * 시간 유효성 검사
 */
export const isValidTime = (time: string): boolean => {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
};

/**
 * 시간 범위 유효성 검사 (startTime < endTime)
 */
export const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  if (!isValidTime(startTime) || !isValidTime(endTime)) return false;
  return getMinutesDifference(startTime, endTime) > 0;
};
