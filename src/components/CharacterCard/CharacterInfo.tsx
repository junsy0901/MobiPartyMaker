import type { Character } from "../../types";
import { formatPower } from "./utils";

interface CharacterInfoProps {
  character: Character;
}

export function CharacterInfo({ character }: CharacterInfoProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-white font-semibold truncate">
          {character.characterName}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md text-xs font-medium">
          {character.className}
        </span>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-gray-400">
          @{character.accountName}
        </span>
        <span className="text-xs text-amber-400 font-medium">
          ⚔️ {formatPower(character.power)}
        </span>
      </div>
    </div>
  );
}

