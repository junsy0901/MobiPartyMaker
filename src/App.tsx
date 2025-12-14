import { useState, useEffect } from "react";
import type { Character, Party } from "./types";
import { CharacterForm } from "./components/CharacterForm";
import { CharacterCard } from "./components/CharacterCard";
import { PartyPanel } from "./components/PartyPanel";
import { PARTY_SIZE } from "./constants/classes";

// localStorage 키
const STORAGE_KEYS = {
  CHARACTERS: "mobi_party_characters",
  PARTIES: "mobi_party_parties",
};

// localStorage에서 데이터 불러오기
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
  }
  return defaultValue;
};

// localStorage에 데이터 저장하기
const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

function App() {
  const [characters, setCharacters] = useState<Character[]>(() =>
    loadFromStorage(STORAGE_KEYS.CHARACTERS, [])
  );
  const [parties, setParties] = useState<Party[]>(() =>
    loadFromStorage(STORAGE_KEYS.PARTIES, [])
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // 캐릭터 변경 시 localStorage에 저장
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CHARACTERS, characters);
  }, [characters]);

  // 파티 변경 시 localStorage에 저장
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PARTIES, parties);
  }, [parties]);

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

  // 전체 초기화
  const handleResetAll = () => {
    setCharacters([]);
    setParties([]);
    setIsResetModalOpen(false);
    showToast("모든 데이터가 초기화되었습니다.", "success");
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

  // 자동 파티 생성
  const handleAutoAssign = () => {
    if (parties.length === 0) {
      showToast("먼저 파티를 생성해주세요!", "error");
      return;
    }

    const availableChars = characters.filter(
      (char) => !isCharacterInAnyParty(char.id)
    );

    if (availableChars.length === 0) {
      showToast("배치 가능한 캐릭터가 없습니다!", "error");
      return;
    }

    // 전투력 순으로 정렬 (높은 순)
    const sortedChars = [...availableChars].sort((a, b) => b.power - a.power);

    // 새로운 파티 상태 복사
    const newParties = parties.map((p) => ({
      ...p,
      slots: [...p.slots],
    }));

    // 사용된 캐릭터 추적
    const usedCharIds = new Set<string>();

    // 1단계: 조건이 있는 파티에 조건을 만족시키는 캐릭터 우선 배치
    for (const party of newParties) {
      if (party.conditions.length === 0) continue;

      // 파티에 이미 있는 계정 추적
      const usedAccounts = new Set(
        party.slots.filter((s) => s !== null).map((s) => s!.accountName)
      );

      for (const condition of party.conditions) {
        // 현재 조건 충족 수 계산
        const currentCount = party.slots.filter(
          (slot) => slot && condition.classNames.includes(slot.className)
        ).length;

        const needed = condition.minCount - currentCount;
        if (needed <= 0) continue;

        // 조건에 맞는 캐릭터 찾기
        const matchingChars = sortedChars.filter(
          (char) =>
            condition.classNames.includes(char.className) &&
            !usedCharIds.has(char.id) &&
            !usedAccounts.has(char.accountName)
        );

        let filled = 0;
        for (const char of matchingChars) {
          if (filled >= needed) break;

          // 빈 슬롯 찾기
          const emptySlotIndex = party.slots.findIndex((s) => s === null);
          if (emptySlotIndex === -1) break;

          party.slots[emptySlotIndex] = char;
          usedCharIds.add(char.id);
          usedAccounts.add(char.accountName);
          filled++;
        }
      }
    }

    // 2단계: 남은 캐릭터를 빈 슬롯에 배치 (전투력 순)
    const remainingChars = sortedChars.filter(
      (char) => !usedCharIds.has(char.id)
    );

    for (const char of remainingChars) {
      // 빈 슬롯이 있는 파티 찾기 (같은 계정이 없는 파티)
      for (const party of newParties) {
        const usedAccounts = new Set(
          party.slots.filter((s) => s !== null).map((s) => s!.accountName)
        );

        if (usedAccounts.has(char.accountName)) continue;

        const emptySlotIndex = party.slots.findIndex((s) => s === null);
        if (emptySlotIndex === -1) continue;

        party.slots[emptySlotIndex] = char;
        usedCharIds.add(char.id);
        break;
      }
    }

    setParties(newParties);

    const assignedCount = usedCharIds.size;
    if (assignedCount > 0) {
      showToast(`${assignedCount}명의 캐릭터가 자동 배치되었습니다!`, "success");
    } else {
      showToast("배치할 수 있는 캐릭터가 없습니다.", "error");
    }
  };

  // 배치되지 않은 캐릭터만 필터링
  const availableCharacters = characters.filter(
    (char) => !isCharacterInAnyParty(char.id)
  );

  // 계정별로 캐릭터 그룹화
  const groupedCharacters = characters.reduce((acc, char) => {
    if (!acc[char.accountName]) {
      acc[char.accountName] = [];
    }
    acc[char.accountName].push(char);
    return acc;
  }, {} as Record<string, Character[]>);

  // 그룹 내 모든 캐릭터가 파티에 배치되었는지 확인
  const isAccountFullyAssigned = (accountName: string) => {
    const accountChars = groupedCharacters[accountName];
    return accountChars.every((char) => isCharacterInAnyParty(char.id));
  };

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

      {/* 초기화 확인 모달 */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsResetModalOpen(false)}
          />
          
          {/* 모달 컨텐츠 */}
          <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#12121f] rounded-2xl border border-[#2d2d44] shadow-2xl p-6 max-w-md w-full mx-4 animate-modal-in">
            {/* 경고 아이콘 */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* 제목 */}
            <h3 className="text-xl font-bold text-white text-center mb-2">
              전체 초기화
            </h3>

            {/* 설명 */}
            <p className="text-gray-400 text-center mb-6">
              모든 <span className="text-red-400 font-semibold">신청자 목록</span>과{" "}
              <span className="text-red-400 font-semibold">파티 정보</span>가
              삭제됩니다.
              <br />
              이 작업은 되돌릴 수 없습니다.
            </p>

            {/* 버튼 그룹 */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="flex-1 px-4 py-3 bg-[#2d2d44] text-gray-300 font-semibold rounded-xl hover:bg-[#3d3d54] transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleResetAll}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl hover:from-red-500 hover:to-red-400 transition-all shadow-lg"
              >
                초기화
              </button>
            </div>
          </div>
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
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {availableCharacters.length}명 대기중 / 총 {characters.length}명
              </span>
              <button
                onClick={() => setIsResetModalOpen(true)}
                disabled={characters.length === 0}
                className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 font-medium rounded-lg hover:bg-red-500/20 hover:border-red-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm flex items-center gap-1.5"
                title="모든 데이터 초기화"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                초기화
              </button>
            </div>
          </div>

          {characters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-3xl mb-2">📭</p>
              <p>등록된 캐릭터가 없습니다. 위에서 캐릭터를 추가해주세요.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin">
              {Object.entries(groupedCharacters).map(([accountName, chars]) => {
                const allAssigned = isAccountFullyAssigned(accountName);
                const availableCount = chars.filter(
                  (c) => !isCharacterInAnyParty(c.id)
                ).length;

                return (
                  <div
                    key={accountName}
                    className={`flex-shrink-0 bg-gradient-to-br from-[#12121f] to-[#0f0f1a] rounded-xl border p-3 ${
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
                              onRemove={() => handleRemoveCharacter(character.id)}
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

        {/* 파티 목록 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">🎮</span>
              파티 목록
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoAssign}
                disabled={parties.length === 0 || availableCharacters.length === 0}
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
        @keyframes modal-in {
          from {
            transform: scale(0.9) translateY(-20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out;
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
