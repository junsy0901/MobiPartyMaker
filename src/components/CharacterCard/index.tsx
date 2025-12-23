import type { Character } from "../../types";
import { ClassImage } from "./ClassImage";
import { CharacterInfo } from "./CharacterInfo";
import { DeleteButton } from "./DeleteButton";
import { DragHint } from "./DragHint";

interface CharacterCardProps {
  character: Character;
  onRemove?: () => void;
  isDraggable?: boolean;
  isInParty?: boolean;
}

export function CharacterCard({
  character,
  onRemove,
  isDraggable = true,
  isInParty = false,
}: CharacterCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(character));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      className={`
        group relative bg-gradient-to-br from-[#1e1e35] to-[#151525] 
        rounded-xl border border-[#2d2d44] p-4 
        ${
          isDraggable
            ? "cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10"
            : ""
        }
        ${
          isInParty
            ? "bg-gradient-to-br from-[#1a2a3a] to-[#151525] border-emerald-500/30"
            : ""
        }
        transition-all duration-200 select-none
      `}
    >
      {/* 삭제 버튼 */}
      {onRemove && <DeleteButton onRemove={onRemove} />}

      <div className="flex items-center gap-3">
        {/* 클래스 이미지 */}
        <ClassImage className={character.className} isInParty={isInParty} />

        {/* 캐릭터 정보 */}
        <CharacterInfo character={character} />
      </div>

      {/* 드래그 힌트 */}
      <DragHint isDraggable={isDraggable} isInParty={isInParty} />
    </div>
  );
}

