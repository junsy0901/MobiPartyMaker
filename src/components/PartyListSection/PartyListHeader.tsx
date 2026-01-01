interface PartyListHeaderProps {
  isExportDisabled: boolean;
  isAutoAssignDisabled: boolean;
  onExportCSV: () => void;
  onAutoAssignClick: () => void;
  onCreateParty: () => void;
  isTimeMode: boolean;
}

export function PartyListHeader({
  isExportDisabled,
  isAutoAssignDisabled,
  onExportCSV,
  onAutoAssignClick,
  onCreateParty,
  isTimeMode,
}: PartyListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <span className="text-xl">{isTimeMode ? "🕐" : "🎮"}</span>
        {isTimeMode ? "시간별 파티 목록" : "파티 목록"}
      </h2>
      <div className="flex items-center gap-2">
        <button
          onClick={onExportCSV}
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
          onClick={onAutoAssignClick}
          disabled={isAutoAssignDisabled}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 text-sm"
          title={isTimeMode 
            ? "시간 조건과 직업 조건에 맞게 캐릭터를 자동으로 파티에 배치합니다" 
            : "조건에 맞게 캐릭터를 자동으로 파티에 배치합니다"
          }
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
        {!isTimeMode && (
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
        )}
      </div>
    </div>
  );
}

