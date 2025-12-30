import { useState } from "react";
import type { Party, PartyCondition, ClassName } from "../../types";
import { ConditionList } from "./ConditionList";
import { ConditionForm } from "./ConditionForm";

interface ConditionSectionProps {
  party: Party;
  onUpdateConditions: (partyId: string, conditions: PartyCondition[]) => void;
}

export function ConditionSection({
  party,
  onUpdateConditions,
}: ConditionSectionProps) {
  const [isConditionOpen, setIsConditionOpen] = useState(false);

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
      <ConditionList
        party={party}
        conditions={party.conditions}
        onRemoveCondition={handleRemoveCondition}
      />

      {/* 조건 추가 폼 */}
      {isConditionOpen && (
        <ConditionForm onAddCondition={handleAddCondition} />
      )}
    </div>
  );
}

