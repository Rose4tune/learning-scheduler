import { useState, useCallback } from 'react';
import { pixelToTime, timeToPixel } from '@/shared/lib';

interface UseResizeOptions {
  snapToGrid?: (time: string) => string;
  onResizeEnd?: (id: string, newStartTime: string, newEndTime: string) => void;
}

export const useResize = (options: UseResizeOptions = {}) => {
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<'top' | 'bottom' | null>(null);
  const [originalStart, setOriginalStart] = useState<string | null>(null);
  const [originalEnd, setOriginalEnd] = useState<string | null>(null);

  const startResize = useCallback(
    (id: string, handle: 'top' | 'bottom', startTime: string, endTime: string) => {
      setResizingId(id);
      setResizeHandle(handle);
      setOriginalStart(startTime);
      setOriginalEnd(endTime);
    },
    []
  );

  const updateResize = useCallback(
    (clientY: number, containerTop: number) => {
      if (!resizingId || !resizeHandle || !originalStart || !originalEnd) return null;

      const relativeY = clientY - containerTop;
      const newTime = pixelToTime(Math.max(0, relativeY));

      let newStartTime = originalStart;
      let newEndTime = originalEnd;

      if (resizeHandle === 'top') {
        newStartTime = newTime;
        // 시작 시간이 종료 시간보다 늦으면 안됨
        if (timeToPixel(newStartTime) >= timeToPixel(originalEnd)) {
          newStartTime = originalEnd;
        }
      } else {
        newEndTime = newTime;
        // 종료 시간이 시작 시간보다 빠르면 안됨
        if (timeToPixel(newEndTime) <= timeToPixel(originalStart)) {
          newEndTime = originalStart;
        }
      }

      const snappedStart = options.snapToGrid ? options.snapToGrid(newStartTime) : newStartTime;
      const snappedEnd = options.snapToGrid ? options.snapToGrid(newEndTime) : newEndTime;

      return {
        startTime: snappedStart,
        endTime: snappedEnd,
      };
    },
    [resizingId, resizeHandle, originalStart, originalEnd, options.snapToGrid]
  );

  const endResize = useCallback(
    (newStartTime: string, newEndTime: string) => {
      if (resizingId) {
        options.onResizeEnd?.(resizingId, newStartTime, newEndTime);
      }
      setResizingId(null);
      setResizeHandle(null);
      setOriginalStart(null);
      setOriginalEnd(null);
    },
    [resizingId, options]
  );

  const cancelResize = useCallback(() => {
    setResizingId(null);
    setResizeHandle(null);
    setOriginalStart(null);
    setOriginalEnd(null);
  }, []);

  return {
    resizingId,
    resizeHandle,
    startResize,
    updateResize,
    endResize,
    cancelResize,
  };
};
