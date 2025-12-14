import type { ClassName } from '../types';

export const CLASS_LIST: ClassName[] = [
  '검술사',
  '격투가',
  '궁수',
  '대검전사',
  '댄서',
  '도적',
  '듀얼블레이드',
  '마법사',
  '빙결술사',
  '사제',
  '석궁사수',
  '수도사',
  '악사',
  '암흑술사',
  '음유시인',
  '장궁병',
  '전격술사',
  '전사',
  '화염술사',
  '힐러',
];

export const getClassImagePath = (className: ClassName): string => {
  return `/assets/${className}.webp`;
};

export const PARTY_SIZE = 8;

