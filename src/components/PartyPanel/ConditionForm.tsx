import { useState } from "react";
import type { ClassName } from "../../types";
import { PARTY_SIZE, getClassImagePath } from "../../constants/classes";
import { CLASS_CATEGORIES } from "../../constants/classCategories";

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
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
          {CLASS_CATEGORIES.map((category) => (
            <div key={category.name}>
              <div className="text-xs text-gray-500 mb-1.5 font-medium">
                {category.name}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {category.classes.map((cls) => {
                  const isSelected = selectedClasses.includes(cls);
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => handleToggleClass(cls)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all ${
                        isSelected
                          ? "bg-indigo-500/20 border-2 border-indigo-400 text-indigo-300"
                          : "bg-[#1a1a2e] border border-[#2d2d44] text-gray-300 hover:border-indigo-500/30"
                      }`}
                    >
                      <img
                        src={getClassImagePath(cls)}
                        alt={cls}
                        className="w-5 h-5 rounded object-cover"
                      />
                      <span className="text-xs">{cls}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
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
