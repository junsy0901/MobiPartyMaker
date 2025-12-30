import { useState } from "react";
import type { ClassName } from "../../types";
import { CLASS_LIST } from "../../constants/classes";
import { PARTY_SIZE } from "../../constants/classes";

interface ConditionFormProps {
  onAddCondition: (classNames: ClassName[], minCount: number) => void;
}

export function ConditionForm({ onAddCondition }: ConditionFormProps) {
  const [selectedClasses, setSelectedClasses] = useState<ClassName[]>([]);
  const [newConditionCount, setNewConditionCount] = useState("1");

  const handleToggleClass = (className: ClassName) => {
    setSelectedClasses((prev) =>
      prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className]
    );
  };

  const handleAddCondition = () => {
    const count = parseInt(newConditionCount, 10);
    if (isNaN(count) || count < 1 || selectedClasses.length === 0) return;

    onAddCondition([...selectedClasses], count);

    // 폼 초기화
    setSelectedClasses([]);
    setNewConditionCount("1");
  };

  return (
    <div className="mt-2 p-3 bg-[#0f0f1a] rounded-lg border border-[#2d2d44]">
      <div className="mb-3">
        <label className="block text-xs text-gray-400 mb-2">
          직업 선택 (여러 개 선택 가능)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
          {CLASS_LIST.map((cls) => {
            const isSelected = selectedClasses.includes(cls);
            return (
              <label
                key={cls}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                    : "bg-[#1a1a2e] border-[#2d2d44] text-gray-300 hover:border-indigo-500/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleClass(cls)}
                  className="w-4 h-4 rounded border-[#2d2d44] bg-[#0f0f1a] text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                />
                <span className="text-sm">{cls}</span>
              </label>
            );
          })}
        </div>
        {selectedClasses.length > 0 && (
          <p className="mt-2 text-xs text-indigo-300">
            선택됨: {selectedClasses.join(", ")}
          </p>
        )}
      </div>
      <div className="flex items-end gap-2">
        <div className="w-32">
          <label className="block text-xs text-gray-400 mb-1">
            최소 인원
          </label>
          <input
            type="number"
            value={newConditionCount}
            onChange={(e) => setNewConditionCount(e.target.value)}
            min="1"
            max={PARTY_SIZE}
            className="w-full px-3 py-2 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleAddCondition}
          disabled={selectedClasses.length === 0}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          조건 추가
        </button>
      </div>
    </div>
  );
}



