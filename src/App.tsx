import { CharacterForm } from "./components/CharacterForm";
import { CharacterCard } from "./components/CharacterCard";
import { PartyPanel } from "./components/PartyPanel";
import { Toast } from "./components/Toast";
import { usePartyMaker } from "./hooks";

function App() {
  const {
    toast,
    characters,
    parties,
    availableCharacters,
    groupedCharacters,
    handleAddCharacter,
    handleRemoveCharacter,
    isCharacterInAnyParty,
    isAccountFullyAssigned,
    handleCreateParty,
    handleRemoveParty,
    handleUpdatePartyName,
    handleUpdatePartyConditions,
    handleDropCharacter,
    handleRemoveFromParty,
    handleAutoAssign,
  } = usePartyMaker();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a15] via-[#0f0f1a] to-[#0a0a15]">
      {/* 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* 토스트 메시지 */}
      {toast && <Toast message={toast.message} type={toast.type} />}

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

        {/* 신청자 목록과 파티 목록 (수평 배치 1:2 비율) */}
        <div className="flex gap-6 mb-6">
          {/* 신청자 목록 (1/3 비율) */}
          <div className="flex-[1] bg-[#1a1a2e] rounded-2xl p-4 border border-[#2d2d44] shadow-xl flex flex-col">
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
              <div className="flex flex-wrap gap-4 flex-1 overflow-y-auto pr-2 scrollbar-thin">
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

          {/* 파티 목록 (2/3 비율) */}
          <div className="flex-[2] flex flex-col">
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
              <div className="bg-[#1a1a2e] rounded-2xl p-10 border border-[#2d2d44] text-center flex-1 flex flex-col items-center justify-center">
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
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin">
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
        </div>

        {/* 푸터 */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>
            💡 팁: 같은 계정의 캐릭터는 하나의 파티에 한 명만 배치할 수 있습니다
          </p>
        </footer>
      </div>

      {/* 스크롤바 스타일 */}
      <style>{`
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
