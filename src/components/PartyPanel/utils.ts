import type { Party, PartyCondition, ClassName } from "../../types";

// 조건 검증: 현재 파티가 조건을 만족하는지 확인 (여러 클래스 중 합산)
export const checkCondition = (
  party: Party,
  condition: PartyCondition
): boolean => {
  const totalCount = party.slots.filter(
    (slot) => slot && condition.classNames.includes(slot.className)
  ).length;
  return totalCount >= condition.minCount;
};

// 선택된 클래스들의 총 인원 수 계산
export const getSelectedClassesCount = (
  party: Party,
  classNames: ClassName[]
): number => {
  return party.slots.filter(
    (slot) => slot && classNames.includes(slot.className)
  ).length;
};

// 평균 전투력 계산
export const calculateAveragePower = (party: Party): number => {
  const filledSlots = party.slots.filter((s) => s !== null).length;
  const totalPower = party.slots.reduce(
    (sum, char) => sum + (char?.power || 0),
    0
  );
  return filledSlots > 0 ? totalPower / filledSlots : 0;
};

// 전투력 포맷팅
export const formatPower = (power: number): string => {
  if (Number.isInteger(power)) {
    return power.toLocaleString();
  }
  return power.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
};




