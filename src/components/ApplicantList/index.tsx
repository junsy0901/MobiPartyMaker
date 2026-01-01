import { useState } from "react";
import type { Character, TimeSlot, AccountTimeSlots } from "../../types";
import { TIME_SLOTS } from "../../types";
import { CharacterCard } from "../CharacterCard";
import { ConfirmModal } from "../ConfirmModal";

interface ApplicantListProps {
  characters: Character[];
  availableCharacters: Character[];
  groupedCharacters: Record<string, Character[]>;
  isAccountFullyAssigned: (accountName: string) => boolean;
  isCharacterInAnyParty: (characterId: string) => boolean;
  onRemoveCharacter: (characterId: string) => void;
  onRemoveFromAllParties: (characterId: string) => void;
  onClearAll: () => void;
  isTimeMode: boolean;
  accountTimeSlots: AccountTimeSlots;
  onUpdateAccountTimeSlots: (accountName: string, timeSlots: TimeSlot[]) => void;
}

export function ApplicantList({
  characters,
  availableCharacters,
  groupedCharacters,
  isAccountFullyAssigned,
  isCharacterInAnyParty,
  onRemoveCharacter,
  onRemoveFromAllParties,
  onClearAll,
  isTimeMode,
  accountTimeSlots,
  onUpdateAccountTimeSlots,
}: ApplicantListProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = e.dataTransfer.getData("application/json");
      const droppedCharacter = JSON.parse(data) as Character;
      onRemoveFromAllParties(droppedCharacter.id);
    } catch (error) {
      console.error("드롭 처리 중 오류 발생:", error);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-[3] h-fit self-start sticky top-6 bg-[#1a1a2e] rounded-2xl p-4 border-2 shadow-xl flex flex-col transition-all ${
        isDragOver
          ? "border-emerald-400 bg-emerald-500/5"
          : "border-[#2d2d44]"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl">👥 신청자 목록</span>
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {availableCharacters.length}명 대기중 / 총 {characters.length}명
          </span>
          {characters.length > 0 && (
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-colors flex items-center gap-1"
              title="모든 신청자 초기화"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              초기화
            </button>
          )}
        </div>
      </div>

      {/* 초기화 확인 모달 */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        title="신청자 목록 초기화"
        message={`등록된 모든 신청자(${characters.length}명)를 삭제하시겠습니까?\n파티에 배치된 캐릭터도 함께 제거됩니다.\n\n이 작업은 되돌릴 수 없습니다.`}
        confirmText="초기화"
        cancelText="취소"
        onConfirm={() => {
          setIsClearModalOpen(false);
          onClearAll();
        }}
        onCancel={() => setIsClearModalOpen(false)}
      />

      {characters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-3xl mb-2">📭</p>
          <p>등록된 캐릭터가 없습니다. 위에서 캐릭터를 추가해주세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100vh-240px)] pr-2 scrollbar-thin snap-y snap-mandatory">
          {Object.entries(groupedCharacters).map(([accountName, chars]) => {
            const allAssigned = isAccountFullyAssigned(accountName);
            const availableCount = chars.filter(
              (c) => !isCharacterInAnyParty(c.id)
            ).length;

            const currentTimeSlots = accountTimeSlots[accountName] || [];
            
            const handleTimeSlotToggle = (hour: TimeSlot) => {
              if (currentTimeSlots.includes(hour)) {
                onUpdateAccountTimeSlots(
                  accountName,
                  currentTimeSlots.filter((h) => h !== hour)
                );
              } else {
                onUpdateAccountTimeSlots(
                  accountName,
                  [...currentTimeSlots, hour].sort((a, b) => a - b)
                );
              }
            };

            return (
              <div
                key={accountName}
                className={`bg-gradient-to-br from-[#12121f] to-[#0f0f1a] rounded-xl border p-3 h-fit snap-start ${
                  allAssigned
                    ? "border-[#2d2d44]/50 opacity-50"
                    : "border-[#3d3d54]"
                }`}
              >
                {/* 계정 헤더 */}
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#2d2d44]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {accountName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-semibold text-sm truncate block">
                      @{accountName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {availableCount}/{chars.length}명 대기중
                    </span>
                  </div>
                </div>

                {/* 시간 모드일 때 가능 시간 선택 */}
                {isTimeMode && (
                  <div className="mb-2 pb-2 border-b border-[#2d2d44]">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs text-gray-400 mr-1">🕐</span>
                      {TIME_SLOTS.map((hour) => {
                        const isSelected = currentTimeSlots.length === 0 || currentTimeSlots.includes(hour);
                        return (
                          <button
                            key={hour}
                            onClick={() => handleTimeSlotToggle(hour)}
                            className={`px-2 py-0.5 text-xs rounded transition-colors ${
                              isSelected
                                ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/50"
                                : "bg-[#2d2d44] text-gray-500 border border-transparent"
                            }`}
                            title={isSelected ? `${hour}시 가능` : `${hour}시 불가능 (클릭하여 가능하게)`}
                          >
                            {hour}시
                          </button>
                        );
                      })}
                    </div>
                    {currentTimeSlots.length === 0 && (
                      <span className="text-xs text-gray-500 mt-1 block">
                        모든 시간 가능 (클릭하여 제한)
                      </span>
                    )}
                  </div>
                )}

                {/* 캐릭터 목록 */}
                <div className="space-y-2">
                  {chars.map((character) => {
                    const inParty = isCharacterInAnyParty(character.id);
                    return (
                      <div
                        key={character.id}
                        className={inParty ? "opacity-40 pointer-events-none" : ""}
                      >
                        <CharacterCard
                          character={character}
                          onRemove={() => onRemoveCharacter(character.id)}
                          isDraggable={!inParty}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

