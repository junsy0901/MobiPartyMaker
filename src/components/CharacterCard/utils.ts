// 전투력 포맷팅 함수
export const formatPower = (power: number): string => {
  // 정수인 경우 정수로, 소수인 경우 소수점 첫째자리까지 표시
  if (Number.isInteger(power)) {
    return power.toLocaleString();
  }
  return power.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
};

