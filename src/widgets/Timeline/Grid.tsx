import React from 'react';

export const Grid: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-gray-50">
      {hours.map((hour) => (
        <div
          key={hour}
          className="h-20 px-4 py-2 text-sm text-gray-600 border-b border-gray-200 font-medium"
        >
          {hour.toString().padStart(2, '0')}:00
        </div>
      ))}
    </div>
  );
};
