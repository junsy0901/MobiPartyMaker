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

// 시간 슬롯 타입 (0시~23시)
export type TimeSlot = number;

// 시간 범위 생성 헬퍼 함수 (자정을 넘기는 경우도 지원: 21시~2시 = 21,22,23,0,1,2)
export function generateTimeSlots(startHour: number, endHour: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  if (startHour <= endHour) {
    // 일반적인 경우: 8시~12시
    for (let i = startHour; i <= endHour; i++) {
      slots.push(i);
    }
  } else {
    // 자정을 넘기는 경우: 21시~2시 = 21,22,23,0,1,2
    for (let i = startHour; i <= 23; i++) {
      slots.push(i);
    }
    for (let i = 0; i <= endHour; i++) {
      slots.push(i);
    }
  }
  
  return slots;
}

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
