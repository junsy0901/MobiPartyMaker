import type { ClassName } from "../../types";
import { CLASS_LIST } from "../../constants/classes";
import { CLASS_ALIASES } from "./constants";

// 클래스명 부분 매칭 함수
export const findClassByPartialName = (input: string): ClassName | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 별칭 매칭
  if (CLASS_ALIASES[trimmed]) {
    return CLASS_ALIASES[trimmed];
  }

  // 정확히 일치하는 경우
  const exactMatch = CLASS_LIST.find((cls) => cls === trimmed);
  if (exactMatch) return exactMatch;

  // 부분 매칭 (입력값을 포함하는 클래스)
  const partialMatch = CLASS_LIST.find((cls) => cls.includes(trimmed));
  if (partialMatch) return partialMatch;

  // 클래스가 입력값으로 시작하는 경우
  const startsWithMatch = CLASS_LIST.find((cls) => cls.startsWith(trimmed));
  if (startsWithMatch) return startsWithMatch;

  return null;
};

// 한 줄 파싱 함수 (슬래시 또는 띄어쓰기로 구분, 순서 자동 감지)
export const parseLine = (
  line: string
): { charName: string; className: ClassName; power: number } | null => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return null;

  let parts: string[];

  // 슬래시가 있으면 슬래시로 분리
  if (trimmedLine.includes("/")) {
    parts = trimmedLine.split("/").map((part) => part.trim());
  } else {
    // 띄어쓰기로 분리
    parts = trimmedLine.split(/\s+/);
  }

  if (parts.length < 3) return null;

  // 순서에 관계없이 각 요소를 자동 감지
  let charName: string | null = null;
  let matchedClass: ClassName | null = null;
  let powerNum: number | null = null;
  const usedIndices = new Set<number>();

  // 1. 숫자(전투력) 찾기
  for (let i = 0; i < parts.length; i++) {
    const num = parseFloat(parts[i]);
    if (!isNaN(num) && parts[i].match(/^[\d.]+$/)) {
      powerNum = num;
      usedIndices.add(i);
      break;
    }
  }

  // 2. 클래스명 찾기
  for (let i = 0; i < parts.length; i++) {
    if (usedIndices.has(i)) continue;
    const cls = findClassByPartialName(parts[i]);
    if (cls) {
      matchedClass = cls;
      usedIndices.add(i);
      break;
    }
  }

  // 3. 나머지는 캐릭터명
  const namePartsArr = parts.filter((_, i) => !usedIndices.has(i));
  charName = namePartsArr.join(" ").trim();

  // 모든 필수 요소가 있는지 확인
  if (!charName || !matchedClass || powerNum === null) return null;

  return {
    charName,
    className: matchedClass,
    power: Math.round(powerNum * 10) / 10,
  };
};

