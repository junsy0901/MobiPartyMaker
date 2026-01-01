import { useState } from "react";
import type { Party, PartyCondition, ClassName } from "../../types";
import { PARTY_SIZE } from "../../constants/classes";
import { calculateAveragePower, formatPower } from "./utils";
import { ConditionList } from "./ConditionList";
import { ConditionForm } from "./ConditionForm";

interface PartyHeaderProps {
  party: Party;
  onUpdatePartyName: (partyId: string, name: string) => void;
  onRemoveParty: (partyId: string) => void;
  onUpdateConditions: (partyId: string, conditions: PartyCondition[]) => void;
}

export function PartyHeader({
  party,
  onUpdatePartyName,
  onRemoveParty,
  onUpdateConditions,
}: PartyHeaderProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConditionFormOpen, setIsConditionFormOpen] = useState(false);

  const filledSlots = party.slots.filter((s) => s !== null).length;
  const averagePower = calculateAveragePower(party);

  const handleAddCondition = (classNames: ClassName[], minCount: number) => {
    onUpdateConditions(party.id, [
      ...party.conditions,
      { classNames, minCount },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    onUpdateConditions(
      party.id,
      party.conditions.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="p-4 border-b border-[#2d2d44] bg-[#0f0f1a]/50">
      {/* 상단: 파티 이름 + 요약 정보 + 토글 버튼 + 삭제 버튼 */}
      <div className="flex items-center justify-between gap-3">
        {/* 파티 이름 (왼쪽) */}
        <input
          type="text"
          value={party.name}
          onChange={(e) => onUpdatePartyName(party.id, e.target.value)}
          className="bg-transparent text-lg font-bold text-white border-none outline-none focus:ring-0 min-w-0 flex-shrink"
          placeholder="파티 이름"
        />

        {/* 요약 정보 + 버튼들 (오른쪽) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* 요약 정보 */}
          <div className="flex items-center gap-3 text-sm">
            <span
              className={`font-semibold ${
                filledSlots === PARTY_SIZE ? "text-emerald-400" : "text-gray-400"
              }`}
            >
              {filledSlots}/{PARTY_SIZE}
            </span>
            <span className="text-amber-400 font-semibold">
              ⚔️ {filledSlots === 0 ? "0" : formatPower(averagePower)}
            </span>
            {party.conditions.length > 0 && (
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs">
                조건 {party.conditions.length}개
              </span>
            )}
          </div>

          {/* 상세 정보 토글 버튼 */}
          <button
            onClick={() => setIsDetailOpen(!isDetailOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isDetailOpen
                ? "text-indigo-400 bg-indigo-500/10"
                : "text-gray-400 hover:text-white hover:bg-[#2d2d44]"
            }`}
            title={isDetailOpen ? "상세 정보 숨기기" : "상세 정보 보기"}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isDetailOpen ? "rotate-180" : ""}`}
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
          </button>

          {/* 파티 삭제 버튼 */}
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
      </div>

      {/* 상세 정보 (토글) */}
      {isDetailOpen && (
        <div className="mt-3 pt-3 border-t border-[#2d2d44]">
          {/* 인원 및 전투력 상세 */}
          <div className="flex items-center gap-6 text-sm mb-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">파티 인원</span>
              <span
                className={`font-semibold ${
                  filledSlots === PARTY_SIZE ? "text-emerald-400" : "text-white"
                }`}
              >
                {filledSlots}/{PARTY_SIZE}명
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">평균 전투력</span>
              <span className="font-semibold text-amber-400">
                ⚔️ {filledSlots === 0 ? "0" : formatPower(averagePower)}
              </span>
            </div>
          </div>

          {/* 파티 조건 */}
          <div className="pt-3 border-t border-[#2d2d44]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-300">파티 조건</span>
                {party.conditions.length > 0 && (
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs">
                    {party.conditions.length}개
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsConditionFormOpen(!isConditionFormOpen)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  isConditionFormOpen
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "bg-[#2d2d44] text-gray-300 hover:bg-[#3d3d54]"
                }`}
              >
                {isConditionFormOpen ? "닫기" : "+ 조건 추가"}
              </button>
            </div>

            {/* 조건 목록 */}
            <ConditionList
              party={party}
              conditions={party.conditions}
              onRemoveCondition={handleRemoveCondition}
            />

            {/* 조건 추가 폼 */}
            {isConditionFormOpen && (
              <ConditionForm onAddCondition={handleAddCondition} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
