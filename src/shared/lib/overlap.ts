/**
 * 겹침 계산 유틸리티 함수들
 */

export interface TimeBlock {
  id: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}

/**
 * 두 시간 블록이 겹치는지 확인
 */
export const isOverlapping = (block1: TimeBlock, block2: TimeBlock): boolean => {
  const start1 = timeToMinutes(block1.startTime);
  const end1 = timeToMinutes(block1.endTime);
  const start2 = timeToMinutes(block2.startTime);
  const end2 = timeToMinutes(block2.endTime);

  return start1 < end2 && start2 < end1;
};

/**
 * 시간 블록 배열에서 겹치는 블록들 찾기
 */
export const findOverlappingBlocks = (blocks: TimeBlock[]): TimeBlock[][] => {
  const groups: TimeBlock[][] = [];
  const processed = new Set<string>();

  blocks.forEach((block) => {
    if (processed.has(block.id)) return;

    const overlapping = blocks.filter(
      (other) => other.id !== block.id && isOverlapping(block, other)
    );

    if (overlapping.length > 0) {
      const group = [block, ...overlapping];
      groups.push(group);
      group.forEach((b) => processed.add(b.id));
    }
  });

  return groups;
};

/**
 * 겹치는 블록들의 레이아웃 계산 (가로 배치)
 */
export interface BlockLayout {
  id: string;
  left: number;  // % (0-100)
  width: number; // % (0-100)
}

export const calculateOverlapLayout = (blocks: TimeBlock[]): BlockLayout[] => {
  if (blocks.length <= 1) {
    return blocks.map((block) => ({
      id: block.id,
      left: 0,
      width: 100,
    }));
  }

  // 시작 시간 기준으로 정렬
  const sorted = [...blocks].sort((a, b) => 
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  const columns: string[][] = [];
  sorted.forEach((block) => {
    let placed = false;
    for (const column of columns) {
      const lastInColumn = blocks.find((b) => b.id === column[column.length - 1])!;
      if (!isOverlapping(block, lastInColumn)) {
        column.push(block.id);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([block.id]);
    }
  });

  const columnWidth = 100 / columns.length;
  const layout: BlockLayout[] = [];

  columns.forEach((column, colIndex) => {
    column.forEach((blockId) => {
      layout.push({
        id: blockId,
        left: colIndex * columnWidth,
        width: columnWidth,
      });
    });
  });

  return layout;
};

// Helper function
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
