import { useState } from "react";
import type { Character, Party, PartyCondition } from "../../types";
import { PartyPanel } from "../PartyPanel";
import { ConfirmModal } from "../ConfirmModal";

interface PartyListSectionProps {
  parties: Party[];
  availableCharactersCount: number;
  totalCharactersCount: number;
  onCreateParty: () => void;
  onAutoAssign: () => void;
  onDropCharacter: (partyId: string, slotIndex: number, character: Character) => void;
  onRemoveCharacter: (partyId: string, slotIndex: number) => void;
  onRemoveParty: (partyId: string) => void;
  onUpdatePartyName: (partyId: string, name: string) => void;
  onUpdateConditions: (partyId: string, conditions: PartyCondition[]) => void;
}

export function PartyListSection({
  parties,
  availableCharactersCount,
  totalCharactersCount,
  onCreateParty,
  onAutoAssign,
  onDropCharacter,
  onRemoveCharacter,
  onRemoveParty,
  onUpdatePartyName,
  onUpdateConditions,
}: PartyListSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAutoAssignDisabled = parties.length === 0 || totalCharactersCount === 0;

  const handleAutoAssignClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmAutoAssign = () => {
    setIsModalOpen(false);
    onAutoAssign();
  };

  return (
    <div className="flex-[5] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl">🎮</span>
          파티 목록
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoAssignClick}
            disabled={isAutoAssignDisabled}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 text-sm"
            title="조건에 맞게 캐릭터를 자동으로 파티에 배치합니다"
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            자동 배치
          </button>
          <button
            onClick={onCreateParty}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 text-sm"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            파티 생성
          </button>
        </div>
      </div>

      {parties.length === 0 ? (
        <EmptyPartyState onCreateParty={onCreateParty} />
      ) : (
        <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin">
          {parties.map((party) => (
            <PartyPanel
              key={party.id}
              party={party}
              onDropCharacter={onDropCharacter}
              onRemoveCharacter={onRemoveCharacter}
              onRemoveParty={onRemoveParty}
              onUpdatePartyName={onUpdatePartyName}
              onUpdateConditions={onUpdateConditions}
            />
          ))}
        </div>
      )}

      {/* 자동 배치 경고 모달 */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="자동 배치 실행"
        message={`자동 배치를 실행하면 현재 파티에 배치된 모든 캐릭터가 초기화되고,\n파티 조건에 맞추어 다시 배치됩니다.\n\n계속하시겠습니까?`}
        confirmText="재배치"
        cancelText="취소"
        onConfirm={handleConfirmAutoAssign}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}

function EmptyPartyState({ onCreateParty }: { onCreateParty: () => void }) {
  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-10 border border-[#2d2d44] text-center flex-1 flex flex-col items-center justify-center">
      <p className="text-4xl mb-3">🎯</p>
      <h3 className="text-lg font-semibold text-white mb-2">
        파티를 생성해주세요
      </h3>
      <p className="text-gray-400 mb-4 text-sm">
        파티를 생성하고 캐릭터를 드래그하여 배치하세요
      </p>
      <button
        onClick={onCreateParty}
        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all inline-flex items-center gap-2 text-sm"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        첫 파티 만들기
      </button>
    </div>
  );
}
