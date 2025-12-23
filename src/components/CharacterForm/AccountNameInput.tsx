interface AccountNameInputProps {
  accountName: string;
  onAccountNameChange: (value: string) => void;
}

export function AccountNameInput({
  accountName,
  onAccountNameChange,
}: AccountNameInputProps) {
  return (
    <div className="w-[180px] flex-shrink-0">
      <label className="block text-xs font-medium text-gray-300 mb-1.5">
        대표 캐릭터
      </label>
      <input
        type="text"
        value={accountName}
        onChange={(e) => onAccountNameChange(e.target.value)}
        placeholder="대표 캐릭터"
        className="w-full px-3 py-2.5 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
      />
    </div>
  );
}

