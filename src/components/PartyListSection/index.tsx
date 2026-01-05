import { useState, useRef } from "react";
import type { Character, Party, PartyCondition, TimeSlot } from "../../types";
import { PartyPanel } from "../PartyPanel";
import { ConfirmModal } from "../ConfirmModal";
import { PartyListHeader } from "./PartyListHeader";
import { exportToCSV } from "./exportCSV";
import { exportToImage } from "./exportImage";

interface PartyListSectionProps {
  parties: Party[];
  availableCharactersCount: number;
  totalCharactersCount: number;
  selectedTimeSlots: TimeSlot[];
  onCreateParty: (timeSlot?: TimeSlot) => void;
  onAutoAssign: () => void;
  onDropCharacter: (partyId: string, slotIndex: number, character: Character) => void;
  onRemoveCharacter: (partyId: string, slotIndex: number) => void;
  onRemoveParty: (partyId: string) => void;
  onUpdatePartyName: (partyId: string, name: string) => void;
  onUpdateConditions: (partyId: string, conditions: PartyCondition[]) => void;
  isTimeMode: boolean;
  isAccountAvailableAt: (accountName: string, timeSlot: TimeSlot) => boolean;
  showToast?: (message: string, type?: "error" | "success") => void;
}

export function PartyListSection({
  parties,
  availableCharactersCount: _availableCharactersCount,
  totalCharactersCount,
  selectedTimeSlots,
  onCreateParty,
  onAutoAssign,
  onDropCharacter,
  onRemoveCharacter,
  onRemoveParty,
  onUpdatePartyName,
  onUpdateConditions,
  isTimeMode,
  isAccountAvailableAt,
  showToast,
}: PartyListSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const partyListRef = useRef<HTMLDivElement>(null);

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

  const handleExportImage = async () => {
    if (!partyListRef.current) {
      showToast?.("파티 목록을 찾을 수 없습니다.", "error");
      return;
    }

    try {
      await exportToImage(partyListRef.current);
      showToast?.("이미지가 클립보드에 복사되었습니다.", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "이미지 내보내기에 실패했습니다.";
      showToast?.(errorMessage, "error");
      console.error("이미지 내보내기 상세 에러:", error);
    }
  };

  // 시간 모드에서 시간대별로 파티 그룹화
  const groupedPartiesByTime = isTimeMode
    ? selectedTimeSlots.reduce((acc, hour) => {
        acc[hour] = parties.filter((p) => p.timeSlot === hour);
        return acc;
      }, {} as Record<TimeSlot, Party[]>)
    : null;

  return (
    <div className="flex-[5] flex flex-col">
      <PartyListHeader
        isExportDisabled={isExportDisabled}
        isAutoAssignDisabled={isAutoAssignDisabled}
        onExportCSV={handleExportCSV}
        onExportImage={handleExportImage}
        onAutoAssignClick={handleAutoAssignClick}
        onCreateParty={() => onCreateParty()}
        isTimeMode={isTimeMode}
      />

      <div ref={partyListRef}>
        {parties.length === 0 ? (
          <EmptyPartyState onCreateParty={() => onCreateParty()} isTimeMode={isTimeMode} />
        ) : isTimeMode && groupedPartiesByTime ? (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin">
          {selectedTimeSlots.map((hour) => (
            <div key={hour} className="space-y-3">
              {/* 시간대 헤더 */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-xl">🕐</span>
                  {hour}시
                  <span className="text-sm text-gray-400 font-normal">
                    ({groupedPartiesByTime[hour].length}개 파티)
                  </span>
                </h3>
                <button
                  onClick={() => onCreateParty(hour)}
                  className="px-3 py-1.5 bg-[#2d2d44] text-gray-300 hover:bg-[#3d3d54] rounded-lg text-sm transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  파티 추가
                </button>
              </div>
              
              {/* 해당 시간대 파티들 */}
              <div className="space-y-3 pl-2 border-l-2 border-indigo-500/30">
                {groupedPartiesByTime[hour].map((party) => (
                  <PartyPanel
                    key={party.id}
                    party={party}
                    onDropCharacter={onDropCharacter}
                    onRemoveCharacter={onRemoveCharacter}
                    onRemoveParty={onRemoveParty}
                    onUpdatePartyName={onUpdatePartyName}
                    onUpdateConditions={onUpdateConditions}
                    isTimeMode={isTimeMode}
                    isAccountAvailableAt={isAccountAvailableAt}
                  />
                ))}
              </div>
            </div>
          ))}
          </div>
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
                isTimeMode={isTimeMode}
                isAccountAvailableAt={isAccountAvailableAt}
              />
            ))}
          </div>
        )}
      </div>

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

function EmptyPartyState({ onCreateParty, isTimeMode }: { onCreateParty: () => void; isTimeMode: boolean }) {
  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-10 border border-[#2d2d44] text-center flex-1 flex flex-col items-center justify-center">
      <p className="text-4xl mb-3">{isTimeMode ? "🕐" : "🎯"}</p>
      <h3 className="text-lg font-semibold text-white mb-2">
        {isTimeMode ? "시간 모드가 활성화되었습니다" : "파티를 생성해주세요"}
      </h3>
      <p className="text-gray-400 mb-4 text-sm">
        {isTimeMode 
          ? "시간 모드를 켜면 8시~12시 파티가 자동으로 생성됩니다"
          : "파티를 생성하고 캐릭터를 드래그하여 배치하세요"
        }
      </p>
      {!isTimeMode && (
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
      )}
    </div>
  );
}
