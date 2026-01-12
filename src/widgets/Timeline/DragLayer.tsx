import React from 'react';

interface DragLayerProps {
  isDragging: boolean;
  children?: React.ReactNode;
}

export const DragLayer: React.FC<DragLayerProps> = ({ isDragging, children }) => {
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {children}
    </div>
  );
};
