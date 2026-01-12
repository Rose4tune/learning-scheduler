import { useMemo } from 'react';
import { calculateOverlapLayout, isOverlapping, TimeBlock } from '@/shared/lib';

interface BlockWithLayout<T> {
  block: T;
  layout: {
    left: number;
    width: number;
  };
}

/**
 * 겹치는 블록들의 레이아웃을 계산하는 훅
 */
export const useOverlapLayout = <T extends TimeBlock>(blocks: T[]): BlockWithLayout<T>[] => {
  return useMemo(() => {
    if (blocks.length === 0) return [];

    // 모든 블록의 겹침 그룹 찾기
    const groups: T[][] = [];
    const processed = new Set<string>();

    blocks.forEach((block) => {
      if (processed.has(block.id)) return;

      // 이 블록과 겹치는 모든 블록 찾기
      const overlapping = blocks.filter(
        (other) => other.id !== block.id && isOverlapping(block, other)
      );

      if (overlapping.length > 0) {
        // 겹치는 그룹 생성
        const group = [block, ...overlapping];
        groups.push(group);
        group.forEach((b) => processed.add(b.id));
      } else {
        // 겹치지 않는 블록은 단독 그룹
        groups.push([block]);
        processed.add(block.id);
      }
    });

    // 각 그룹별로 레이아웃 계산
    const result: BlockWithLayout<T>[] = [];

    groups.forEach((group) => {
      const layouts = calculateOverlapLayout(group);
      
      group.forEach((block, index) => {
        const layout = layouts.find((l) => l.id === block.id);
        result.push({
          block,
          layout: {
            left: layout?.left || 0,
            width: layout?.width || 100,
          },
        });
      });
    });

    return result;
  }, [blocks]);
};
