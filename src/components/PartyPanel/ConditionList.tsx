import type { Party, PartyCondition } from "../../types";
import { ConditionItem } from "./ConditionItem";

interface ConditionListProps {
  party: Party;
  conditions: PartyCondition[];
  onRemoveCondition: (index: number) => void;
}

export function ConditionList({
  party,
  conditions,
  onRemoveCondition,
}: ConditionListProps) {
  if (conditions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {conditions.map((condition, index) => (
        <ConditionItem
          key={index}
          party={party}
          condition={condition}
          index={index}
          onRemove={onRemoveCondition}
        />
      ))}
    </div>
  );
}



