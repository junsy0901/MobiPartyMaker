import type { Character } from "../../types";
import { CharacterCard } from "../CharacterCard";

interface ApplicantListProps {
  characters: Character[];
  availableCharacters: Character[];
  groupedCharacters: Record<string, Character[]>;
  isAccountFullyAssigned: (accountName: string) => boolean;
  isCharacterInAnyParty: (characterId: string) => boolean;
  onRemoveCharacter: (characterId: string) => void;
}

export function ApplicantList({
  characters,
  availableCharacters,
  groupedCharacters,
  isAccountFullyAssigned,
  isCharacterInAnyParty,
  onRemoveCharacter,
}: ApplicantListProps) {
  return (
    <div className="flex-[3] bg-[#1a1a2e] rounded-2xl p-4 border border-[#2d2d44] shadow-xl flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl">👥 신청자 목록</span>
        </h2>
        <span className="text-sm text-gray-400">
          {availableCharacters.length}명 대기중 / 총 {characters.length}명
        </span>
      </div>

      {characters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-3xl mb-2">📭</p>
          <p>등록된 캐릭터가 없습니다. 위에서 캐릭터를 추가해주세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2 scrollbar-thin">
          {Object.entries(groupedCharacters).map(([accountName, chars]) => {
            const allAssigned = isAccountFullyAssigned(accountName);
            const availableCount = chars.filter(
              (c) => !isCharacterInAnyParty(c.id)
            ).length;

            return (
              <div
                key={accountName}
                className={`bg-gradient-to-br from-[#12121f] to-[#0f0f1a] rounded-xl border p-3 h-fit ${
                  allAssigned
                    ? "border-[#2d2d44]/50 opacity-50"
                    : "border-[#3d3d54]"
                }`}
              >
                {/* 계정 헤더 */}
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#2d2d44]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
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

