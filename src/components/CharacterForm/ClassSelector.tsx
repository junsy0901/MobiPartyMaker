import type { ClassName } from "../../types";
import { CLASS_LIST, getClassImagePath } from "../../constants/classes";

interface ClassSelectorProps {
  className: ClassName;
  onClassNameChange: (className: ClassName) => void;
}

export function ClassSelector({
  className,
  onClassNameChange,
}: ClassSelectorProps) {
  return (
    <div className="flex-1 min-w-[140px]">
      <label className="block text-xs font-medium text-gray-300 mb-1.5">
        클래스
      </label>
      <div className="flex items-center gap-2">
        <img
          src={getClassImagePath(className)}
          alt={className}
          className="w-10 h-10 rounded-lg object-cover border border-[#2d2d44]"
        />
        <div className="relative flex-1">
          <select
            value={className}
            onChange={(e) => onClassNameChange(e.target.value as ClassName)}
            className="w-full px-3 py-2.5 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer text-sm pr-8"
          >
            {CLASS_LIST.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

