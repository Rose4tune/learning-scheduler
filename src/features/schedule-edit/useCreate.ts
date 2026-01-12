import { useState, useCallback } from 'react';
import { pixelToTime } from '@/shared/lib';

interface UseCreateOptions {
  snapToGrid?: (time: string) => string;
  onCreateEnd?: (startTime: string, endTime: string) => void;
  onCreateCancel?: () => void;
}

export const useCreate = (options: UseCreateOptions = {}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [createStart, setCreateStart] = useState<string | null>(null);
  const [createEnd, setCreateEnd] = useState<string | null>(null);

  const startCreate = useCallback((clientY: number, containerTop: number) => {
    const relativeY = clientY - containerTop;
    const time = pixelToTime(relativeY);
    const snappedTime = options.snapToGrid ? options.snapToGrid(time) : time;
    
    setIsCreating(true);
    setCreateStart(snappedTime);
    setCreateEnd(snappedTime);
  }, [options.snapToGrid]);

  const updateCreate = useCallback((clientY: number, containerTop: number) => {
    if (!isCreating || !createStart) return;

    const relativeY = clientY - containerTop;
    const time = pixelToTime(relativeY);
    const snappedTime = options.snapToGrid ? options.snapToGrid(time) : time;
    
    setCreateEnd(snappedTime);
  }, [isCreating, createStart, options.snapToGrid]);

  const endCreate = useCallback(() => {
    if (createStart && createEnd && createStart !== createEnd) {
      // 시작과 끝 중 작은 값을 시작, 큰 값을 끝으로
      const [start, end] = createStart < createEnd 
        ? [createStart, createEnd] 
        : [createEnd, createStart];
      
      options.onCreateEnd?.(start, end);
    }
    
    setIsCreating(false);
    setCreateStart(null);
    setCreateEnd(null);
  }, [createStart, createEnd, options]);

  const cancelCreate = useCallback(() => {
    setIsCreating(false);
    setCreateStart(null);
    setCreateEnd(null);
    options.onCreateCancel?.();
  }, [options]);

  return {
    isCreating,
    createStart,
    createEnd,
    startCreate,
    updateCreate,
    endCreate,
    cancelCreate,
  };
};
