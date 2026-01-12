import { useState } from 'react';

interface UseMoveOptions {
  onMoveStart?: (id: string) => void;
  onMove?: (id: string, newStartTime: string) => void;
  onMoveEnd?: (id: string, newStartTime: string) => void;
}

export const useMove = (options: UseMoveOptions = {}) => {
  const [movingId, setMovingId] = useState<string | null>(null);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });

  const startMove = (id: string, clientY: number) => {
    setMovingId(id);
    setMoveOffset({ x: 0, y: clientY });
    options.onMoveStart?.(id);
  };

  const updateMove = (id: string, clientY: number, snapToTime: (y: number) => string) => {
    const deltaY = clientY - moveOffset.y;
    const newStartTime = snapToTime(deltaY);
    options.onMove?.(id, newStartTime);
  };

  const endMove = (id: string, newStartTime: string) => {
    options.onMoveEnd?.(id, newStartTime);
    setMovingId(null);
    setMoveOffset({ x: 0, y: 0 });
  };

  return {
    movingId,
    startMove,
    updateMove,
    endMove,
  };
};
