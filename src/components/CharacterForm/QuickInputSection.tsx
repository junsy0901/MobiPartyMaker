import { parseLine } from "./utils";

interface QuickInputSectionProps {
  quickInput: string;
  quickInputError: string;
  onQuickInputChange: (value: string) => void;
  onAccountNameChange: (value: string) => void;
  onCharacterNameChange: (value: string) => void;
  onClassNameChange: (className: string) => void;
  onPowerChange: (value: string) => void;
  onBulkRegister: () => void;
}

export function QuickInputSection({
  quickInput,
  quickInputError,
  onQuickInputChange,
  onAccountNameChange,
  onCharacterNameChange,
  onClassNameChange,
  onPowerChange,
  onBulkRegister,
}: QuickInputSectionProps) {
  const handleQuickInputChange = (value: string) => {
    onQuickInputChange(value);

    const lines = value.split("\n").filter((line) => line.trim());

    // 여러 줄 입력 시 첫 번째 줄의 캐릭터명을 계정명으로 자동 채우기 (항상 덮어쓰기)
    if (lines.length > 1) {
      const firstLine = lines[0];
      const parsed = parseLine(firstLine);
      if (parsed) {
        // 항상 첫 번째 캐릭터명으로 계정명 채우기
        onAccountNameChange(parsed.charName);
      }
    }
    // 한 줄만 있는 경우 기존처럼 필드에 자동 채우기
    else if (lines.length === 1) {
      const parsed = parseLine(value);
      if (parsed) {
        onCharacterNameChange(parsed.charName);
        onClassNameChange(parsed.className);
        onPowerChange(parsed.power + "");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter로 일괄 등록
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      onBulkRegister();
    }
  };

  const isMultiLine =
    quickInput.split("\n").filter((line) => line.trim()).length > 1;

  return (
    <div className="flex-1">
      <label className="block text-xs font-medium text-gray-300 mb-1.5">
        ⚡ 빠른 입력 (여러 줄 가능)
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <textarea
            value={quickInput}
            onChange={(e) => handleQuickInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`캐릭터명 / 클래스 / 전투력 (또는 띄어쓰기)
베롤 / 궁수 / 5.6
베틀 힐러 5.2
베럴 전사 5.3`}
            rows={isMultiLine ? 8 : 6}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none"
          />
          {quickInput && (
            <button
              type="button"
              onClick={() => {
                onQuickInputChange("");
                // 에러도 초기화하기 위해 빈 문자열 전달
              }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {/* 일괄 등록 버튼 */}
        <button
          type="button"
          onClick={onBulkRegister}
          disabled={!quickInput.trim()}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all transform hover:scale-105 active:scale-95 shadow-lg text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none self-start"
        >
          일괄 등록
        </button>
      </div>
      {quickInputError && (
        <p className="mt-1 text-xs text-red-400 whitespace-pre-line">
          {quickInputError}
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        여러 줄 입력 후 일괄 등록 또는 Ctrl+Enter
      </p>
    </div>
  );
}

