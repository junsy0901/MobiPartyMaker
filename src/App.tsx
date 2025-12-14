import { useState } from "react";
import type { Character, Party } from "./types";
import type { PartyCondition } from "./types";
import { CharacterForm } from "./components/CharacterForm";
import { CharacterCard } from "./components/CharacterCard";
import { PartyPanel } from "./components/PartyPanel";
import { PARTY_SIZE } from "./constants/classes";

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  // 토스트 메시지 표시
  const showToast = (message: string, type: "error" | "success" = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 캐릭터 추가
  const handleAddCharacter = (character: Character) => {
    // 중복 체크: 같은 계정명 + 같은 캐릭터명
    const isDuplicate = characters.some(
      (c) =>
        c.accountName === character.accountName &&
        c.characterName === character.characterName
    );

    if (isDuplicate) {
      showToast(
        `이미 등록된 캐릭터입니다: ${character.accountName} - ${character.characterName}`,
        "error"
      );
      return;
    }

    setCharacters((prev) => [...prev, character]);
    showToast(`${character.characterName} 캐릭터가 등록되었습니다!`, "success");
  };

  // 캐릭터 삭제 (리스트에서)
  const handleRemoveCharacter = (characterId: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== characterId));
  };

  // 파티 생성
  const handleCreateParty = () => {
    const newParty: Party = {
      id: `party-${Date.now()}`,
      name: `파티 ${parties.length + 1}`,
      slots: Array(PARTY_SIZE).fill(null),
      conditions: [],
    };
    setParties((prev) => [...prev, newParty]);
  };

  // 파티 삭제
  const handleRemoveParty = (partyId: string) => {
    setParties((prev) => prev.filter((p) => p.id !== partyId));
  };

  // 파티 이름 변경
  const handleUpdatePartyName = (partyId: string, name: string) => {
    setParties((prev) =>
      prev.map((p) => (p.id === partyId ? { ...p, name } : p))
    );
  };

  // 파티 조건 업데이트
  const handleUpdatePartyConditions = (
    partyId: string,
    conditions: Party["conditions"]
  ) => {
    setParties((prev) =>
      prev.map((p) => (p.id === partyId ? { ...p, conditions } : p))
    );
  };

  // 캐릭터를 파티에 드롭
  const handleDropCharacter = (
    partyId: string,
    slotIndex: number,
    character: Character
  ) => {
    const party = parties.find((p) => p.id === partyId);
    if (!party) return;

    // 같은 계정의 다른 캐릭터가 이미 파티에 있는지 확인
    const existingAccountCharacter = party.slots.find(
      (slot) =>
        slot !== null &&
        slot.accountName === character.accountName &&
        slot.id !== character.id
    );

    if (existingAccountCharacter) {
      showToast(
        `이미 같은 계정(${character.accountName})의 캐릭터가 이 파티에 있습니다!`,
        "error"
      );
      return;
    }

    // 해당 슬롯에 이미 캐릭터가 있으면 교체
    setParties((prev) =>
      prev.map((p) => {
        if (p.id !== partyId) return p;

        // 같은 캐릭터가 이미 다른 슬롯에 있다면 제거
        const newSlots = p.slots.map((slot) =>
          slot?.id === character.id ? null : slot
        );

        // 지정된 슬롯에 캐릭터 배치
        newSlots[slotIndex] = character;

        return { ...p, slots: newSlots };
      })
    );
  };

  // 파티에서 캐릭터 제거
  const handleRemoveFromParty = (partyId: string, slotIndex: number) => {
    setParties((prev) =>
      prev.map((p) => {
        if (p.id !== partyId) return p;
        const newSlots = [...p.slots];
        newSlots[slotIndex] = null;
        return { ...p, slots: newSlots };
      })
    );
  };

  // 파티에 배치된 캐릭터인지 확인
  const isCharacterInAnyParty = (characterId: string) => {
    return parties.some((party) =>
      party.slots.some((slot) => slot?.id === characterId)
    );
  };

  // 배치되지 않은 캐릭터만 필터링
  const availableCharacters = characters.filter(
    (char) => !isCharacterInAnyParty(char.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a15] via-[#0f0f1a] to-[#0a0a15]">
      {/* 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* 토스트 메시지 */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-xl animate-slide-in ${
            toast.type === "error"
              ? "bg-red-500/90 text-white"
              : "bg-emerald-500/90 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="relative max-w-[1800px] mx-auto p-6">
        {/* 헤더 */}
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
            ⚔️ 파티 메이커
          </h1>
          <p className="text-gray-400">
            캐릭터를 등록하고 드래그하여 파티를 구성하세요
          </p>
        </header>

        {/* 캐릭터 등록 (가로 레이아웃) */}
        <div className="mb-6">
          <CharacterForm onAddCharacter={handleAddCharacter} />
        </div>

        {/* 캐릭터 목록 (가로 레이아웃) */}
        <div className="bg-[#1a1a2e] rounded-2xl p-4 border border-[#2d2d44] shadow-xl mb-6">
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
            <div className="flex flex-wrap gap-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className={`flex-shrink-0 w-[280px] ${
                    isCharacterInAnyParty(character.id)
                      ? "opacity-40 pointer-events-none"
                      : ""
                  }`}
                >
                  <CharacterCard
                    character={character}
                    onRemove={() => handleRemoveCharacter(character.id)}
                    isDraggable={!isCharacterInAnyParty(character.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 파티 목록 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">🎮</span>
              파티 목록
            </h2>
            <button
              onClick={handleCreateParty}
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

          {parties.length === 0 ? (
            <div className="bg-[#1a1a2e] rounded-2xl p-10 border border-[#2d2d44] text-center">
              <p className="text-4xl mb-3">🎯</p>
              <h3 className="text-lg font-semibold text-white mb-2">
                파티를 생성해주세요
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                파티를 생성하고 캐릭터를 드래그하여 배치하세요
              </p>
              <button
                onClick={handleCreateParty}
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
          ) : (
            <div className="space-y-4">
              {parties.map((party) => (
                <PartyPanel
                  key={party.id}
                  party={party}
                  onDropCharacter={handleDropCharacter}
                  onRemoveCharacter={handleRemoveFromParty}
                  onRemoveParty={handleRemoveParty}
                  onUpdatePartyName={handleUpdatePartyName}
                  onUpdateConditions={handleUpdatePartyConditions}
                />
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>
            💡 팁: 같은 계정의 캐릭터는 하나의 파티에 한 명만 배치할 수 있습니다
          </p>
        </footer>
      </div>

      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #2d2d44;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #3d3d54;
        }
      `}</style>
    </div>
  );
}

export default App;
