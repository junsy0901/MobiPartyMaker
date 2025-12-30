import { useState } from "react";
import type { Character, ClassName } from "../../types";
import { AccountNameInput } from "./AccountNameInput";
import { QuickInputSection } from "./QuickInputSection";
import { IndividualInputSection } from "./IndividualInputSection";
import { parseLine } from "./utils";

interface CharacterFormProps {
  onAddCharacter: (character: Character) => void;
}

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

  const handleQuickInputChange = (value: string) => {
    setQuickInput(value);
    setQuickInputError("");
  };

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
        <AccountNameInput
          accountName={accountName}
          onAccountNameChange={setAccountName}
        />

        <QuickInputSection
          quickInput={quickInput}
          quickInputError={quickInputError}
          onQuickInputChange={handleQuickInputChange}
          onAccountNameChange={setAccountName}
          onCharacterNameChange={setCharacterName}
          onClassNameChange={(cls) => setClassName(cls as ClassName)}
          onPowerChange={setPower}
          onBulkRegister={handleBulkRegister}
        />
      </div>

      {/* 구분선 */}
      <div className="border-t border-[#2d2d44] my-4" />

      {/* 개별 입력 필드들 */}
      <IndividualInputSection
        characterName={characterName}
        className={className}
        power={power}
        onCharacterNameChange={setCharacterName}
        onClassNameChange={setClassName}
        onPowerChange={setPower}
        onSubmit={handleSubmit}
      />
    </form>
  );
}

