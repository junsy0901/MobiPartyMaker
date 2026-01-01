import type { Party, Character, PartyCondition, TimeSlot } from "../../types";
import { PartySlot } from "../PartySlot";
import { PartyHeader } from "./PartyHeader";

interface PartyPanelProps {
  party: Party;
  onDropCharacter: (
    partyId: string,
    slotIndex: number,
    character: Character
  ) => void;
  onRemoveCharacter: (partyId: string, slotIndex: number) => void;
  onRemoveParty: (partyId: string) => void;
  onUpdatePartyName: (partyId: string, name: string) => void;
  onUpdateConditions: (partyId: string, conditions: PartyCondition[]) => void;
  isTimeMode?: boolean;
  isAccountAvailableAt?: (accountName: string, timeSlot: TimeSlot) => boolean;
}

export function PartyPanel({
  party,
  onDropCharacter,
  onRemoveCharacter,
  onRemoveParty,
  onUpdatePartyName,
  onUpdateConditions,
  isTimeMode,
  isAccountAvailableAt,
}: PartyPanelProps) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#12121f] rounded-2xl border border-[#2d2d44] overflow-hidden shadow-xl">
      {/* 파티 헤더 */}
      <PartyHeader
        party={party}
        onUpdatePartyName={onUpdatePartyName}
        onRemoveParty={onRemoveParty}
        onUpdateConditions={onUpdateConditions}
        isTimeMode={isTimeMode}
      />

      {/* 파티 슬롯들 - 수평 배치 (8명: 4x2) */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {party.slots.map((character, index) => (
          <PartySlot
            key={index}
            index={index}
            character={character}
            onDrop={(char) => onDropCharacter(party.id, index, char)}
            onRemove={() => onRemoveCharacter(party.id, index)}
            isTimeMode={isTimeMode}
            timeSlot={party.timeSlot}
            isAccountAvailableAt={isAccountAvailableAt}
          />
        ))}
      </div>
    </div>
  );
}

