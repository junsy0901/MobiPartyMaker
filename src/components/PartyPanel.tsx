import { useState } from "react";
import type { Party, Character, PartyCondition, ClassName } from "../types";
import { PartySlot } from "./PartySlot";
import { PARTY_SIZE, CLASS_LIST } from "../constants/classes";

interface PartyPanelProps {
  party: Party;
  onDropCharacter: (
    partyId: string,
    slotIndex: number,
    character: Character
  ) => void;
  onRemoveCharacter: (partyId: string, slotIndex: number) => void;
  onRemoveParty: (partyId: string) => void;
  onUpdatePartyName: (partyId: string, name: string) => void;
  onUpdateConditions: (partyId: string, conditions: PartyCondition[]) => void;
}

export function PartyPanel({
  party,
  onDropCharacter,
  onRemoveCharacter,
  onRemoveParty,
  onUpdatePartyName,
  onUpdateConditions,
}: PartyPanelProps) {
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<ClassName[]>([]);
  const [newConditionCount, setNewConditionCount] = useState("1");

  const filledSlots = party.slots.filter((s) => s !== null).length;
  const totalPower = party.slots.reduce(
    (sum, char) => sum + (char?.power || 0),
    0
  );
  const averagePower = filledSlots > 0 ? totalPower / filledSlots : 0;

  // 조건 검증: 현재 파티가 조건을 만족하는지 확인 (여러 클래스 중 합산)
  const checkCondition = (condition: PartyCondition): boolean => {
    const totalCount = party.slots.filter(
      (slot) => slot && condition.classNames.includes(slot.className)
    ).length;
    return totalCount >= condition.minCount;
  };

  // 선택된 클래스들의 총 인원 수 계산
  const getSelectedClassesCount = (classNames: ClassName[]): number => {
    return party.slots.filter(
      (slot) => slot && classNames.includes(slot.className)
    ).length;
  };

  const handleToggleClass = (className: ClassName) => {
    setSelectedClasses((prev) =>
      prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className]
    );
  };

  const handleAddCondition = () => {
    const count = parseInt(newConditionCount, 10);
    if (isNaN(count) || count < 1 || selectedClasses.length === 0) return;

    // 새 조건 추가
    onUpdateConditions(party.id, [
      ...party.conditions,
      { classNames: [...selectedClasses], minCount: count },
    ]);

    // 폼 초기화
    setSelectedClasses([]);
    setNewConditionCount("1");
  };

  const handleRemoveCondition = (index: number) => {
    onUpdateConditions(
      party.id,
      party.conditions.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#12121f] rounded-2xl border border-[#2d2d44] overflow-hidden shadow-xl">
      {/* 파티 헤더 */}
      <div className="p-4 border-b border-[#2d2d44] bg-[#0f0f1a]/50">
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            value={party.name}
            onChange={(e) => onUpdatePartyName(party.id, e.target.value)}
            className="bg-transparent text-lg font-bold text-white border-none outline-none focus:ring-0 w-full mr-2"
            placeholder="파티 이름"
          />
          <button
            onClick={() => onRemoveParty(party.id)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="파티 삭제"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">인원</span>
            <span
              className={`font-semibold ${
                filledSlots === PARTY_SIZE ? "text-emerald-400" : "text-white"
              }`}
            >
              {filledSlots}/{PARTY_SIZE}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">평균 전투력</span>
            <span className="font-semibold text-amber-400">
              ⚔️{" "}
              {filledSlots === 0
                ? "0"
                : Number.isInteger(averagePower)
                ? averagePower.toLocaleString()
                : averagePower.toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
            </span>
          </div>
        </div>

        {/* 조건 섹션 */}
        <div className="mt-3 pt-3 border-t border-[#2d2d44]">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setIsConditionOpen(!isConditionOpen)}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  isConditionOpen ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="font-medium">파티 조건</span>
              {party.conditions.length > 0 && (
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs">
                  {party.conditions.length}개
                </span>
              )}
            </button>
          </div>

          {/* 조건 목록 */}
          {party.conditions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {party.conditions.map((condition, index) => {
                const currentCount = getSelectedClassesCount(
                  condition.classNames
                );
                const isSatisfied = currentCount >= condition.minCount;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border ${
                      isSatisfied
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-red-500/10 border-red-500/30 text-red-300"
                    }`}
                  >
                    <span className="font-medium">
                      {condition.classNames.length === 1
                        ? condition.classNames[0]
                        : `${condition.classNames.join(", ")} 중`}
                    </span>
                    <span className="text-xs">
                      {currentCount}/{condition.minCount}명
                    </span>
                    {isSatisfied ? (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
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
                    )}
                    <button
                      onClick={() => handleRemoveCondition(index)}
                      className="ml-1 text-gray-400 hover:text-white transition-colors"
                      title="조건 삭제"
                    >
                      <svg
                        className="w-3 h-3"
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
                  </div>
                );
              })}
            </div>
          )}

          {/* 조건 추가 폼 */}
          {isConditionOpen && (
            <div className="mt-2 p-3 bg-[#0f0f1a] rounded-lg border border-[#2d2d44]">
              <div className="mb-3">
                <label className="block text-xs text-gray-400 mb-2">
                  직업 선택 (여러 개 선택 가능)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                  {CLASS_LIST.map((cls) => {
                    const isSelected = selectedClasses.includes(cls);
                    return (
                      <label
                        key={cls}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                            : "bg-[#1a1a2e] border-[#2d2d44] text-gray-300 hover:border-indigo-500/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleClass(cls)}
                          className="w-4 h-4 rounded border-[#2d2d44] bg-[#0f0f1a] text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                        />
                        <span className="text-sm">{cls}</span>
                      </label>
                    );
                  })}
                </div>
                {selectedClasses.length > 0 && (
                  <p className="mt-2 text-xs text-indigo-300">
                    선택됨: {selectedClasses.join(", ")}
                  </p>
                )}
              </div>
              <div className="flex items-end gap-2">
                <div className="w-32">
                  <label className="block text-xs text-gray-400 mb-1">
                    최소 인원
                  </label>
                  <input
                    type="number"
                    value={newConditionCount}
                    onChange={(e) => setNewConditionCount(e.target.value)}
                    min="1"
                    max={PARTY_SIZE}
                    className="w-full px-3 py-2 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={handleAddCondition}
                  disabled={selectedClasses.length === 0}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                  조건 추가
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 파티 슬롯들 - 수평 배치 (8명: 4x2) */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {party.slots.map((character, index) => (
          <PartySlot
            key={index}
            index={index}
            character={character}
            onDrop={(char) => onDropCharacter(party.id, index, char)}
            onRemove={() => onRemoveCharacter(party.id, index)}
          />
        ))}
      </div>
    </div>
  );
}
