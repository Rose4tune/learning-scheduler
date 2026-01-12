import React, { useState } from 'react';
import { Subject } from '@/shared/types';
import { Button } from '@/shared/ui';
import { formatDuration, getMinutesDifference } from '@/shared/lib';

interface CreateModalProps {
  type: 'plan' | 'execution';
  startTime: string;
  endTime: string;
  subjects: Subject[];
  onCreate: (subjectId: string, memo: string) => void;
  onClose: () => void;
}

/**
 * 일정 생성 모달
 * - 드래그로 결정된 시간 범위 표시
 * - 과목 선택 (필수)
 * - 메모 입력 (선택)
 */
export const CreateModal: React.FC<CreateModalProps> = ({
  type,
  startTime,
  endTime,
  subjects,
  onCreate,
  onClose,
}) => {
  const [subjectId, setSubjectId] = useState(subjects.length > 0 ? subjects[0].id : '');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');

  const duration = getMinutesDifference(startTime, endTime);

  // 생성
  const handleCreate = () => {
    if (!subjectId) {
      setError('과목을 선택해주세요.');
      return;
    }

    onCreate(subjectId, memo);
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
          {type === 'plan' ? '계획 생성' : '실행 기록'}
        </h2>

        {/* 시간 범위 표시 (읽기 전용) */}
        <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{startTime}</span>
              <span className="mx-2">→</span>
              <span className="font-medium">{endTime}</span>
            </div>
            <div className="text-sm font-semibold text-blue-600">
              {formatDuration(duration)}
            </div>
          </div>
        </div>

        {/* 과목 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            과목 <span className="text-red-500">*</span>
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.icon && `${subject.icon} `}
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
        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700"
          >
            취소
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            생성
          </Button>
        </div>
      </div>
    </div>
  );
};
