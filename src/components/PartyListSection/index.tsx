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

function exportToCSV(parties: Party[]) {
  const rows: string[][] = [];
  const charsPerRow = 4; // 한 행에 4명씩

  parties.forEach((party, partyIndex) => {
    const filledSlots = party.slots.filter((slot): slot is Character => slot !== null);
    
    // 캐릭터를 charsPerRow 단위로 나눔
    for (let i = 0; i < filledSlots.length; i += charsPerRow) {
      const row: string[] = [];
      
      // 첫 번째 행에만 파티명 추가
      if (i === 0) {
        row.push(party.name);
      } else {
        row.push("");
      }

      // 해당 행의 캐릭터들 추가 (이름, 직업)
      const charsInRow = filledSlots.slice(i, i + charsPerRow);
      charsInRow.forEach((char) => {
        row.push(char.characterName);
        row.push(char.className);
      });

      rows.push(row);
    }

    // 빈 캐릭터가 없는 경우에도 파티명은 표시
    if (filledSlots.length === 0) {
      rows.push([party.name]);
    }

    // 파티 사이에 빈 행 추가 (마지막 파티 제외)
    if (partyIndex < parties.length - 1) {
      rows.push([]);
    }
  });

  // CSV 문자열 생성
  const csvContent = rows.map((row) => row.join(",")).join("\n");
  
  // BOM 추가 (한글 인코딩)
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  
  // 다운로드
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `파티목록_${new Date().toLocaleDateString("ko-KR")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  const isExportDisabled = parties.length === 0 || parties.every((p) => p.slots.every((s) => s === null));

  const handleAutoAssignClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmAutoAssign = () => {
    setIsModalOpen(false);
    onAutoAssign();
  };

  const handleExportCSV = () => {
    exportToCSV(parties);
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
            onClick={handleExportCSV}
            disabled={isExportDisabled}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 text-sm"
            title="파티 목록을 CSV 파일로 내보냅니다"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            CSV 내보내기
          </button>
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
