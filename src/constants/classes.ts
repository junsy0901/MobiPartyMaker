import type { ClassName } from '../types';

export interface ClassGroup {
  name: string;
  classes: ClassName[];
}

export const CLASS_GROUPS: ClassGroup[] = [
  {
    name: '전사 계열',
    classes: ['전사', '검술사', '대검전사'],
  },
  {
    name: '궁수 계열',
    classes: ['궁수', '석궁사수', '장궁병'],
  },
  {
    name: '힐러 계열',
    classes: ['힐러', '수도사', '사제', '암흑술사'],
  },
  {
    name: '마법사 계열',
    classes: ['마법사', '화염술사', '빙결술사', '전격술사'],
  },
  {
    name: '음유시인 계열',
    classes: ['음유시인', '악사', '댄서'],
  },
  {
    name: '도적 계열',
    classes: ['도적', '격투가', '듀얼블레이드'],
  },
];

// 기존 CLASS_LIST는 모든 클래스의 flat 배열 (호환성 유지)
export const CLASS_LIST: ClassName[] = CLASS_GROUPS.flatMap(g => g.classes);

export const getClassImagePath = (className: ClassName): string => {
  return `/assets/${className}.webp`;
};

export const PARTY_SIZE = 8;

