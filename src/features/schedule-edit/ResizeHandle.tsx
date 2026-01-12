import React from 'react';

interface ResizeHandleProps {
  position: 'top' | 'bottom';
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * 블록 리사이즈 핸들 컴포넌트
 */
export const ResizeHandle: React.FC<ResizeHandleProps> = ({ position, onMouseDown }) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // 블록 드래그 이벤트 방지
    onMouseDown(e);
  };

  return (
    <div
      className={`absolute left-0 right-0 h-2 ${
        position === 'top' ? 'top-0 cursor-ns-resize' : 'bottom-0 cursor-ns-resize'
      } hover:bg-blue-400 opacity-0 hover:opacity-30 transition-opacity z-10`}
      onMouseDown={handleMouseDown}
    />
  );
};
