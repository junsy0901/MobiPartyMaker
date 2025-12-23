import type { ClassName } from "../../types";
import { ClassSelector } from "./ClassSelector";

interface IndividualInputSectionProps {
  characterName: string;
  className: ClassName;
  power: string;
  onCharacterNameChange: (value: string) => void;
  onClassNameChange: (className: ClassName) => void;
  onPowerChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function IndividualInputSection({
  characterName,
  className,
  power,
  onCharacterNameChange,
  onClassNameChange,
  onPowerChange,
  onSubmit,
}: IndividualInputSectionProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* 캐릭터명 */}
      <div className="flex-1 min-w-[120px]">
        <label className="block text-xs font-medium text-gray-300 mb-1.5">
          캐릭터명
        </label>
        <input
          type="text"
          value={characterName}
          onChange={(e) => onCharacterNameChange(e.target.value)}
          placeholder="캐릭터명"
          className="w-full px-3 py-2.5 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
        />
      </div>

      {/* 클래스 선택 */}
      <ClassSelector
        className={className}
        onClassNameChange={onClassNameChange}
      />

      {/* 전투력 */}
      <div className="w-[100px]">
        <label className="block text-xs font-medium text-gray-300 mb-1.5">
          전투력
        </label>
        <input
          type="number"
          value={power}
          onChange={(e) => onPowerChange(e.target.value)}
          placeholder="5.4"
          min="0"
          step="0.1"
          className="w-full px-3 py-2.5 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
        />
      </div>

      {/* 개별 등록 버튼 */}
      <button
        type="submit"
        onClick={onSubmit}
        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all transform hover:scale-105 active:scale-95 shadow-lg text-sm whitespace-nowrap"
      >
        개별 등록
      </button>
    </div>
  );
}

