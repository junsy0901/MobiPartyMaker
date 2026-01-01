import { CharacterForm } from "./components/CharacterForm";
import { Toast } from "./components/Toast";
import { ApplicantList } from "./components/ApplicantList";
import { PartyListSection } from "./components/PartyListSection";
import { usePartyMaker } from "./hooks";

function App() {
  const {
    toast,
    characters,
    parties,
    availableCharacters,
    groupedCharacters,
    isTimeMode,
    accountTimeSlots,
    handleAddCharacter,
    handleRemoveCharacter,
    handleClearAllCharacters,
    isCharacterInAnyParty,
    isAccountFullyAssigned,
    handleCreateParty,
    handleRemoveParty,
    handleUpdatePartyName,
    handleUpdatePartyConditions,
    handleDropCharacter,
    handleRemoveFromParty,
    handleRemoveCharacterFromAllParties,
    handleAutoAssign,
    handleToggleTimeMode,
    handleUpdateAccountTimeSlots,
    isAccountAvailableAt,
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
          <p className="text-gray-400 mb-4">
            캐릭터를 등록하고 드래그하여 파티를 구성하세요
          </p>
          
          {/* 시간 모드 토글 */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#1a1a2e] rounded-xl border border-[#2d2d44]">
            <span className="text-sm text-gray-400">시간 모드</span>
            <button
              onClick={() => handleToggleTimeMode(!isTimeMode)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isTimeMode
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                  : "bg-[#2d2d44]"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${
                  isTimeMode ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            {isTimeMode && (
              <span className="text-sm text-indigo-400 font-medium">
                🕐 8시~12시
              </span>
            )}
          </div>
        </header>

        {/* 캐릭터 등록 */}
        <div className="mb-6">
          <CharacterForm onAddCharacter={handleAddCharacter} />
        </div>

        {/* 신청자 목록과 파티 목록 */}
        <div className="flex gap-6 mb-6">
          <ApplicantList
            characters={characters}
            availableCharacters={availableCharacters}
            groupedCharacters={groupedCharacters}
            isAccountFullyAssigned={isAccountFullyAssigned}
            isCharacterInAnyParty={isCharacterInAnyParty}
            onRemoveCharacter={handleRemoveCharacter}
            onRemoveFromAllParties={handleRemoveCharacterFromAllParties}
            onClearAll={handleClearAllCharacters}
            isTimeMode={isTimeMode}
            accountTimeSlots={accountTimeSlots}
            onUpdateAccountTimeSlots={handleUpdateAccountTimeSlots}
          />

          <PartyListSection
            parties={parties}
            availableCharactersCount={availableCharacters.length}
            totalCharactersCount={characters.length}
            onCreateParty={handleCreateParty}
            onAutoAssign={handleAutoAssign}
            onDropCharacter={handleDropCharacter}
            onRemoveCharacter={handleRemoveFromParty}
            onRemoveParty={handleRemoveParty}
            onUpdatePartyName={handleUpdatePartyName}
            onUpdateConditions={handleUpdatePartyConditions}
            isTimeMode={isTimeMode}
            isAccountAvailableAt={isAccountAvailableAt}
          />
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
