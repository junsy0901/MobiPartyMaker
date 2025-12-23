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

// 한 줄 파싱 함수
export const parseLine = (
  line: string
): { charName: string; className: ClassName; power: number } | null => {
  const trimmedLine = line.trim();
  if (!trimmedLine || !trimmedLine.includes("/")) return null;

  const parts = trimmedLine.split("/").map((part) => part.trim());
  if (parts.length < 3) return null;

  const [charName, classInput, powerInput] = parts;
  if (!charName) return null;

  const matchedClass = findClassByPartialName(classInput);
  if (!matchedClass) return null;

  const powerNum = parseFloat(powerInput);
  if (isNaN(powerNum)) return null;

  return {
    charName,
    className: matchedClass,
    power: Math.round(powerNum * 10) / 10,
  };
};

