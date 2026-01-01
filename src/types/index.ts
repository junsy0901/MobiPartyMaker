export type ClassName =
  | '검술사'
  | '격투가'
  | '궁수'
  | '대검전사'
  | '댄서'
  | '도적'
  | '듀얼블레이드'
  | '마법사'
  | '빙결술사'
  | '사제'
  | '석궁사수'
  | '수도사'
  | '악사'
  | '암흑술사'
  | '음유시인'
  | '장궁병'
  | '전격술사'
  | '전사'
  | '화염술사'
  | '힐러';

// 시간 슬롯 타입 (8시~12시)
export type TimeSlot = 8 | 9 | 10 | 11 | 12;

export const TIME_SLOTS: TimeSlot[] = [8, 9, 10, 11, 12];

export interface Character {
  id: string;
  accountName: string;
  characterName: string;
  power: number;
  className: ClassName;
}

// 계정별 가능 시간
export interface AccountTimeSlots {
  [accountName: string]: TimeSlot[];
}

export interface PartyCondition {
  classNames: ClassName[];
  minCount: number;
}

export interface Party {
  id: string;
  name: string;
  slots: (Character | null)[];
  conditions: PartyCondition[];
  timeSlot?: TimeSlot; // 시간 모드에서 사용
}
