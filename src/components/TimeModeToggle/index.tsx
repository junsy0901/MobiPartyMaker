interface TimeModeToggleProps {
  isTimeMode: boolean;
  startHour: number;
  endHour: number;
  onToggle: (enabled: boolean) => void;
  onUpdateTimeRange: (startHour: number, endHour: number) => void;
}

export function TimeModeToggle({ 
  isTimeMode, 
  startHour,
  endHour,
  onToggle, 
  onUpdateTimeRange 
}: TimeModeToggleProps) {
  
  const handleStartHourChange = (value: string) => {
    const newStart = parseInt(value, 10);
    if (!isNaN(newStart)) {
      onUpdateTimeRange(newStart, endHour);
    }
  };

  const handleEndHourChange = (value: string) => {
    const newEnd = parseInt(value, 10);
    if (!isNaN(newEnd)) {
      onUpdateTimeRange(startHour, newEnd);
    }
  };

  const getTimeRangeText = () => {
    if (startHour === endHour) return `${startHour}시`;
    if (startHour > endHour) {
      // 자정을 넘기는 경우: 21시~2시
      return `${startHour}시~${endHour}시 (익일)`;
    }
    return `${startHour}시~${endHour}시`;
  };

  const getPartyCount = () => {
    if (startHour <= endHour) {
      return endHour - startHour + 1;
    } else {
      // 자정을 넘기는 경우: 21시~2시 = (23-21+1) + (2-0+1) = 3 + 3 = 6... 아니 21,22,23,0,1,2 = 6개
      // 더 간단히: 24 - startHour + endHour + 1
      return (24 - startHour) + (endHour + 1);
    }
  };

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
      
      {/* 시간 입력 필드 */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <button
            onClick={() => handleStartHourChange(String(startHour === 0 ? 23 : startHour - 1))}
            className="w-6 h-7 flex items-center justify-center bg-[#2d2d44] hover:bg-[#3d3d54] border border-[#3d3d54] border-r-0 rounded-l-lg text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            min={0}
            max={23}
            value={startHour}
            onChange={(e) => handleStartHourChange(e.target.value)}
            className="time-input w-10 py-1 bg-[#2d2d44] border-y border-[#3d3d54] text-white text-center text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleStartHourChange(String(startHour === 23 ? 0 : startHour + 1))}
            className="w-6 h-7 flex items-center justify-center bg-[#2d2d44] hover:bg-[#3d3d54] border border-[#3d3d54] border-l-0 rounded-r-lg text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <span className="text-gray-400 text-sm">시</span>
        <span className="text-gray-500">~</span>
        <div className="relative flex items-center">
          <button
            onClick={() => handleEndHourChange(String(endHour === 0 ? 23 : endHour - 1))}
            className="w-6 h-7 flex items-center justify-center bg-[#2d2d44] hover:bg-[#3d3d54] border border-[#3d3d54] border-r-0 rounded-l-lg text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            min={0}
            max={23}
            value={endHour}
            onChange={(e) => handleEndHourChange(e.target.value)}
            className="time-input w-10 py-1 bg-[#2d2d44] border-y border-[#3d3d54] text-white text-center text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleEndHourChange(String(endHour === 23 ? 0 : endHour + 1))}
            className="w-6 h-7 flex items-center justify-center bg-[#2d2d44] hover:bg-[#3d3d54] border border-[#3d3d54] border-l-0 rounded-r-lg text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <span className="text-gray-400 text-sm">시</span>
      </div>

      {isTimeMode && (
        <span className="text-sm text-indigo-400 font-medium">
          🕐 {getTimeRangeText()} ({getPartyCount()}개 파티)
        </span>
      )}

      {/* 숫자 입력 스핀 버튼 스타일 */}
      <style>{`
        .time-input::-webkit-outer-spin-button,
        .time-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
          background: transparent;
        }
        .time-input {
          -moz-appearance: textfield;
          appearance: textfield;
        }
        .time-input-wrapper {
          position: relative;
        }
        .time-input-wrapper::after {
          content: '';
          position: absolute;
          right: 2px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: calc(100% - 4px);
          background: linear-gradient(to bottom, #4f46e5 50%, #6366f1 50%);
          border-radius: 4px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .time-input-wrapper:hover::after {
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
