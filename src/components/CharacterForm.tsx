import { useState } from "react";
import type { Character, ClassName } from "../types";
import { CLASS_LIST, getClassImagePath } from "../constants/classes";

interface CharacterFormProps {
  onAddCharacter: (character: Character) => void;
}

// 클래스 별칭 매핑 (축약어 → 정식 클래스명)
const CLASS_ALIASES: Record<string, ClassName> = {
  화술: "화염술사",
};

// 클래스명 부분 매칭 함수
const findClassByPartialName = (input: string): ClassName | null => {
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
const parseLine = (
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

export function CharacterForm({ onAddCharacter }: CharacterFormProps) {
  const [accountName, setAccountName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [power, setPower] = useState("");
  const [className, setClassName] = useState<ClassName>("전사");
  const [quickInput, setQuickInput] = useState("");
  const [quickInputError, setQuickInputError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountName.trim() || !characterName.trim() || !power) {
      return;
    }

    const newCharacter: Character = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      accountName: accountName.trim(),
      characterName: characterName.trim(),
      power: parseFloat(power),
      className,
    };

    onAddCharacter(newCharacter);
    setCharacterName("");
    setPower("");
  };

  // 빠른 입력 변경 핸들러
  const handleQuickInputChange = (value: string) => {
    setQuickInput(value);
    setQuickInputError("");

    const lines = value.split("\n").filter((line) => line.trim());

    // 여러 줄 입력 시 첫 번째 줄의 캐릭터명을 계정명으로 자동 채우기 (항상 덮어쓰기)
    if (lines.length > 1) {
      const firstLine = lines[0];
      if (firstLine.includes("/")) {
        const parsed = parseLine(firstLine);
        if (parsed) {
          // 항상 첫 번째 캐릭터명으로 계정명 채우기
          setAccountName(parsed.charName);
        }
      }
    }
    // 한 줄만 있는 경우 기존처럼 필드에 자동 채우기
    else if (lines.length === 1 && value.includes("/")) {
      const parsed = parseLine(value);
      if (parsed) {
        setCharacterName(parsed.charName);
        setClassName(parsed.className);
        setPower(parsed.power + "");
      }
    }
  };

  // 일괄 등록 (여러 줄 처리)
  const handleBulkRegister = () => {
    const lines = quickInput.split("\n").filter((line) => line.trim());
    if (lines.length === 0) {
      setQuickInputError("등록할 캐릭터 정보를 입력해주세요");
      return;
    }

    // 첫 번째 줄의 캐릭터명을 계정명으로 사용 (항상 덮어쓰기)
    let finalAccountName = accountName.trim();
    if (lines.length > 0) {
      const firstParsed = parseLine(lines[0]);
      if (firstParsed) {
        finalAccountName = firstParsed.charName;
        setAccountName(finalAccountName);
      }
    }

    if (!finalAccountName) {
      setQuickInputError("첫 번째 줄에 올바른 캐릭터 정보를 입력해주세요");
      return;
    }

    const errors: string[] = [];
    const processedCharacters = new Set<string>(); // 같은 입력 내 중복 체크용
    let successCount = 0;

    lines.forEach((line, index) => {
      const parsed = parseLine(line);
      if (parsed) {
        // 같은 입력 내에서 중복 체크 (계정명 + 캐릭터명)
        const characterKey = `${finalAccountName}|${parsed.charName}`;
        if (processedCharacters.has(characterKey)) {
          errors.push(`${index + 1}번 줄: "${parsed.charName}" 중복 입력`);
          return;
        }
        processedCharacters.add(characterKey);

        const newCharacter: Character = {
          id: `${Date.now()}-${index}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          accountName: finalAccountName,
          characterName: parsed.charName,
          power: parsed.power,
          className: parsed.className,
        };
        onAddCharacter(newCharacter);
        successCount++;
      } else if (line.trim()) {
        errors.push(`${index + 1}번 줄: "${line.trim()}" 파싱 실패`);
      }
    });

    if (successCount > 0) {
      setQuickInput("");
      setQuickInputError("");
    }

    if (errors.length > 0) {
      setQuickInputError(errors.join("\n"));
    }
  };

  // 엔터키 또는 Ctrl+Enter로 일괄 등록
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter로 일괄 등록
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleBulkRegister();
    }
  };

  // 여러 줄인지 확인
  const isMultiLine =
    quickInput.split("\n").filter((line) => line.trim()).length > 1;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1a1a2e] rounded-2xl p-6 border border-[#2d2d44] shadow-xl"
    >
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">✨</span>
        캐릭터 등록
      </h2>

      {/* 수평 레이아웃: 계정명 + 빠른 입력 */}
      <div className="flex gap-4 mb-4">
        {/* 대표 캐릭터 */}
        <div className="w-[180px] flex-shrink-0">
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            대표 캐릭터
          </label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="대표 캐릭터"
            className="w-full px-3 py-2.5 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>

        {/* 빠른 입력 (여러 줄 지원) */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            ⚡ 빠른 입력 (여러 줄 가능)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <textarea
                value={quickInput}
                onChange={(e) => handleQuickInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`캐릭터명 / 클래스 / 전투력 (예시)
베롤 / 궁수 / 5.2
베틀 / 힐러 / 4.8
베럴 / 전사 / 4.8`}
                rows={isMultiLine ? 8 : 6}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none"
              />
              {quickInput && (
                <button
                  type="button"
                  onClick={() => {
                    setQuickInput("");
                    setQuickInputError("");
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {/* 일괄 등록 버튼 */}
            <button
              type="button"
              onClick={handleBulkRegister}
              disabled={!quickInput.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all transform hover:scale-105 active:scale-95 shadow-lg text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none self-start"
            >
              일괄 등록
            </button>
          </div>
          {quickInputError && (
            <p className="mt-1 text-xs text-red-400 whitespace-pre-line">
              {quickInputError}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            여러 줄 입력 후 일괄 등록 또는 Ctrl+Enter
          </p>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-[#2d2d44] my-4" />

      {/* 개별 입력 필드들 */}
      <div className="flex flex-wrap items-end gap-3">
        {/* 캐릭터명 */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            캐릭터명
          </label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="캐릭터명"
            className="w-full px-3 py-2.5 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>

        {/* 클래스 선택 */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            클래스
          </label>
          <div className="flex items-center gap-2">
            <img
              src={getClassImagePath(className)}
              alt={className}
              className="w-10 h-10 rounded-lg object-cover border border-[#2d2d44]"
            />
            <div className="relative flex-1">
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value as ClassName)}
                className="w-full px-3 py-2.5 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer text-sm pr-8"
              >
                {CLASS_LIST.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 전투력 */}
        <div className="w-[100px]">
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            전투력
          </label>
          <input
            type="number"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            placeholder="5.4"
            min="0"
            step="0.1"
            className="w-full px-3 py-2.5 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>

        {/* 개별 등록 버튼 */}
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all transform hover:scale-105 active:scale-95 shadow-lg text-sm whitespace-nowrap"
        >
          개별 등록
        </button>
      </div>
    </form>
  );
}
