import type { Party, PartyCondition } from "../../types";
import { PARTY_SIZE } from "../../constants/classes";
import { calculateAveragePower, formatPower } from "./utils";
import { ConditionSection } from "./ConditionSection";

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
  const filledSlots = party.slots.filter((s) => s !== null).length;
  const averagePower = calculateAveragePower(party);

  return (
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
            {filledSlots === 0 ? "0" : formatPower(averagePower)}
          </span>
        </div>
      </div>

      {/* 조건 섹션 */}
      <ConditionSection
        party={party}
        onUpdateConditions={onUpdateConditions}
      />
    </div>
  );
}

