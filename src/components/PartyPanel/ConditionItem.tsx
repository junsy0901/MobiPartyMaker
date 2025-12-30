import type { Party, PartyCondition } from "../../types";
import { getSelectedClassesCount, checkCondition } from "./utils";

interface ConditionItemProps {
  party: Party;
  condition: PartyCondition;
  index: number;
  onRemove: (index: number) => void;
}

export function ConditionItem({
  party,
  condition,
  index,
  onRemove,
}: ConditionItemProps) {
  const currentCount = getSelectedClassesCount(party, condition.classNames);
  const isSatisfied = checkCondition(party, condition);

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border ${
        isSatisfied
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          : "bg-red-500/10 border-red-500/30 text-red-300"
      }`}
    >
      <span className="font-medium">
        {condition.classNames.length === 1
          ? condition.classNames[0]
          : `${condition.classNames.join(", ")} 중`}
      </span>
      <span className="text-xs">
        {currentCount}/{condition.minCount}명
      </span>
      {isSatisfied ? (
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
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
      )}
      <button
        onClick={() => onRemove(index)}
        className="ml-1 text-gray-400 hover:text-white transition-colors"
        title="조건 삭제"
      >
        <svg
          className="w-3 h-3"
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
    </div>
  );
}



