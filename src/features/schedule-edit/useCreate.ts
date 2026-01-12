import { useState } from 'react';

interface UseCreateOptions {
  onCreateStart?: () => void;
  onCreateEnd?: (startTime: string, endTime: string) => void;
  onCreateCancel?: () => void;
}

export const useCreate = (options: UseCreateOptions = {}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [createStart, setCreateStart] = useState<string | null>(null);

  const startCreate = (time: string) => {
    setIsCreating(true);
    setCreateStart(time);
    options.onCreateStart?.();
  };

  const endCreate = (endTime: string) => {
    if (createStart) {
      options.onCreateEnd?.(createStart, endTime);
    }
    setIsCreating(false);
    setCreateStart(null);
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setCreateStart(null);
    options.onCreateCancel?.();
  };

  return {
    isCreating,
    createStart,
    startCreate,
    endCreate,
    cancelCreate,
  };
};
