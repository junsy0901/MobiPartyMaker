interface TimeModeToggleProps {
  isTimeMode: boolean;
  onToggle: (enabled: boolean) => void;
}

export function TimeModeToggle({ isTimeMode, onToggle }: TimeModeToggleProps) {
  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#1a1a2e] rounded-xl border border-[#2d2d44]">
      <span className="text-sm text-gray-400">시간 모드</span>
      <div className="relative group">
        <button
          onClick={() => onToggle(!isTimeMode)}
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
        {/* 툴팁 */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg shadow-xl text-xs text-gray-300 w-max max-w-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-[#1a1a2e] border-r border-b border-[#2d2d44] rotate-45"></div>
          <div className="relative">
            각 길드원들의 가능한 시간대를 입력하여
            <br />
            자동으로 파티를 배치할 수 있습니다.
          </div>
        </div>
      </div>
      {isTimeMode && (
        <span className="text-sm text-indigo-400 font-medium">
          🕐 8시~12시
        </span>
      )}
    </div>
  );
}

