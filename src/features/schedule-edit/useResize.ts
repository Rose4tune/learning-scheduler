import { useState } from 'react';

interface UseResizeOptions {
  onResizeStart?: (id: string, direction: 'top' | 'bottom') => void;
  onResize?: (id: string, newStartTime: string, newEndTime: string) => void;
  onResizeEnd?: (id: string, newStartTime: string, newEndTime: string) => void;
}

export const useResize = (options: UseResizeOptions = {}) => {
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [resizeDirection, setResizeDirection] = useState<'top' | 'bottom' | null>(null);

  const startResize = (id: string, direction: 'top' | 'bottom') => {
    setResizingId(id);
    setResizeDirection(direction);
    options.onResizeStart?.(id, direction);
  };

  const updateResize = (
    id: string,
    clientY: number,
    snapToTime: (y: number) => string,
    currentStart: string,
    currentEnd: string
  ) => {
    if (!resizeDirection) return;

    let newStart = currentStart;
    let newEnd = currentEnd;

    if (resizeDirection === 'top') {
      newStart = snapToTime(clientY);
    } else {
      newEnd = snapToTime(clientY);
    }

    options.onResize?.(id, newStart, newEnd);
  };

  const endResize = (id: string, newStart: string, newEnd: string) => {
    options.onResizeEnd?.(id, newStart, newEnd);
    setResizingId(null);
    setResizeDirection(null);
  };

  return {
    resizingId,
    resizeDirection,
    startResize,
    updateResize,
    endResize,
  };
};
