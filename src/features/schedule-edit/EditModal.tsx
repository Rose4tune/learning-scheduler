import React, { useState, useEffect } from 'react';
import { Plan, Execution, Subject } from '@/shared/types';
import { Button, Input } from '@/shared/ui';

interface EditModalProps {
  type: 'plan' | 'execution';
  item: Plan | Execution;
  subjects: Subject[];
  onSave: (updatedItem: Plan | Execution) => void;
  onDelete?: () => void;
  onClose: () => void;
}

/**
 * 일정 편집 모달
 * - 시작/종료 시간 수정 (10분 단위)
 * - 과목 선택
 * - 메모 수정
 * - 저장/취소/삭제
 */
export const EditModal: React.FC<EditModalProps> = ({
  type,
  item,
  subjects,
  onSave,
  onDelete,
  onClose,
}) => {
  const [startTime, setStartTime] = useState(item.startTime);
  const [endTime, setEndTime] = useState(item.endTime);
  const [subjectId, setSubjectId] = useState(item.subjectId);
  const [memo, setMemo] = useState(item.memo || '');
  const [error, setError] = useState('');

  // 10분 단위로 반올림
  const snapToTenMinutes = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const snappedMinutes = Math.round(totalMinutes / 10) * 10;
    const snappedHours = Math.floor(snappedMinutes / 60);
    const snappedMins = snappedMinutes % 60;
    return `${snappedHours.toString().padStart(2, '0')}:${snappedMins.toString().padStart(2, '0')}`;
  };

  // 시간 유효성 검증
  const validateTimes = (): boolean => {
    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

    if (startMinutes >= endMinutes) {
      setError('종료 시간은 시작 시간보다 나중이어야 합니다.');
      return false;
    }

    if (endMinutes - startMinutes < 10) {
      setError('최소 블록 길이는 10분입니다.');
      return false;
    }

    setError('');
    return true;
  };

  // 시작 시간 변경
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = snapToTenMinutes(e.target.value);
    setStartTime(newStartTime);
  };

  // 종료 시간 변경
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = snapToTenMinutes(e.target.value);
    setEndTime(newEndTime);
  };

  // 저장
  const handleSave = () => {
    if (!validateTimes()) {
      return;
    }

    const updatedItem: Plan | Execution = {
      ...item,
      startTime,
      endTime,
      subjectId,
      memo,
    };

    onSave(updatedItem);
    onClose();
  };

  // 외부 클릭 감지
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {type === 'plan' ? '계획 편집' : '실행 편집'}
        </h2>

        {/* 시작 시간 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시작 시간
          </label>
          <Input
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
            className="w-full"
          />
        </div>

        {/* 종료 시간 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            종료 시간
          </label>
          <Input
            type="time"
            value={endTime}
            onChange={handleEndTimeChange}
            className="w-full"
          />
        </div>

        {/* 과목 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            과목
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* 메모 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            메모
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder="메모를 입력하세요..."
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex justify-between items-center">
          <div>
            {onDelete && (
              <Button
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                삭제
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
