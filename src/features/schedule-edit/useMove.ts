import { useState, useCallback } from 'react';
import { pixelToTime, timeToPixel, getMinutesDifference } from '@/shared/lib';

interface UseMoveOptions {
  snapToGrid?: (time: string) => string;
  onMoveEnd?: (id: string, newStartTime: string, newEndTime: string) => void;
}

export const useMove = (options: UseMoveOptions = {}) => {
  const [movingId, setMovingId] = useState<string | null>(null);
  const [originalStart, setOriginalStart] = useState<string | null>(null);
  const [originalEnd, setOriginalEnd] = useState<string | null>(null);
  const [currentTop, setCurrentTop] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);

  const startMove = useCallback(
    (id: string, startTime: string, endTime: string, clientY: number, blockTop: number) => {
      setMovingId(id);
      setOriginalStart(startTime);
      setOriginalEnd(endTime);
      setStartY(clientY);
      setCurrentTop(blockTop);
    },
    []
  );

  const updateMove = useCallback(
    (clientY: number) => {
      if (!movingId || !originalStart || !originalEnd) return null;

      const deltaY = clientY - startY;
      const newTop = Math.max(0, currentTop + deltaY);

      const newStartTime = pixelToTime(newTop);
      const duration = getMinutesDifference(originalStart, originalEnd);
      const newStartMinutes = parseInt(newStartTime.split(':')[0]) * 60 + parseInt(newStartTime.split(':')[1]);
      const newEndMinutes = newStartMinutes + duration;
      const newEndTime = `${String(Math.floor(newEndMinutes / 60)).padStart(2, '0')}:${String(newEndMinutes % 60).padStart(2, '0')}`;

      const snappedStart = options.snapToGrid ? options.snapToGrid(newStartTime) : newStartTime;
      const snappedStartMinutes = parseInt(snappedStart.split(':')[0]) * 60 + parseInt(snappedStart.split(':')[1]);
      const snappedEndMinutes = snappedStartMinutes + duration;
      const snappedEnd = `${String(Math.floor(snappedEndMinutes / 60)).padStart(2, '0')}:${String(snappedEndMinutes % 60).padStart(2, '0')}`;

      return {
        top: timeToPixel(snappedStart),
        startTime: snappedStart,
        endTime: snappedEnd,
      };
    },
    [movingId, originalStart, originalEnd, startY, currentTop, options.snapToGrid]
  );

  const endMove = useCallback(
    (newStartTime: string, newEndTime: string) => {
      if (movingId) {
        options.onMoveEnd?.(movingId, newStartTime, newEndTime);
      }
      setMovingId(null);
      setOriginalStart(null);
      setOriginalEnd(null);
      setCurrentTop(0);
      setStartY(0);
    },
    [movingId, options]
  );

  const cancelMove = useCallback(() => {
    setMovingId(null);
    setOriginalStart(null);
    setOriginalEnd(null);
    setCurrentTop(0);
    setStartY(0);
  }, []);

  return {
    movingId,
    currentTop,
    startMove,
    updateMove,
    endMove,
    cancelMove,
  };
};
