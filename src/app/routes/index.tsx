import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DayTimelinePage } from '@/pages/DayTimelinePage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/timeline" replace />} />
        <Route path="/timeline" element={<DayTimelinePage />} />
        <Route path="/timeline/:date" element={<DayTimelinePage />} />
      </Routes>
    </BrowserRouter>
  );
};
