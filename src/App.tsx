import { CharacterForm } from "./components/CharacterForm";
import { Toast } from "./components/Toast";
import { ApplicantList } from "./components/ApplicantList";
import { PartyListSection } from "./components/PartyListSection";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { usePartyMaker } from "./hooks";
import { Analytics } from "@vercel/analytics/react";

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
    handleUpdateTimeRange,
    startHour,
    endHour,
    selectedTimeSlots,
    isAccountAvailableAt,
    showToast,
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
        <Header
          isTimeMode={isTimeMode}
          startHour={startHour}
          endHour={endHour}
          onToggleTimeMode={handleToggleTimeMode}
          onUpdateTimeRange={handleUpdateTimeRange}
        />

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
            selectedTimeSlots={selectedTimeSlots}
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
            selectedTimeSlots={selectedTimeSlots}
            onCreateParty={handleCreateParty}
            onAutoAssign={handleAutoAssign}
            onDropCharacter={handleDropCharacter}
            onRemoveCharacter={handleRemoveFromParty}
            onRemoveParty={handleRemoveParty}
            onUpdatePartyName={handleUpdatePartyName}
            onUpdateConditions={handleUpdatePartyConditions}
            isTimeMode={isTimeMode}
            isAccountAvailableAt={isAccountAvailableAt}
            showToast={showToast}
          />
        </div>

        <Footer />
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

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
