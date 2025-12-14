import type { Character } from '../types';
import { getClassImagePath } from '../constants/classes';

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
    e.dataTransfer.setData('application/json', JSON.stringify(character));
    e.dataTransfer.effectAllowed = 'move';
  };

  const formatPower = (power: number) => {
    // 정수인 경우 정수로, 소수인 경우 소수점 첫째자리까지 표시
    if (Number.isInteger(power)) {
      return power.toLocaleString();
    }
    return power.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      className={`
        group relative bg-gradient-to-br from-[#1e1e35] to-[#151525] 
        rounded-xl border border-[#2d2d44] p-4 
        ${isDraggable ? 'cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10' : ''}
        ${isInParty ? 'bg-gradient-to-br from-[#1a2a3a] to-[#151525] border-emerald-500/30' : ''}
        transition-all duration-200 select-none
      `}
    >
      {/* 삭제 버튼 */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="flex items-center gap-3">
        {/* 클래스 이미지 */}
        <div className="relative">
          <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-[#2d2d44] shadow-lg">
            <img
              src={getClassImagePath(character.className)}
              alt={character.className}
              className="w-full h-full object-cover"
            />
          </div>
          {isInParty && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* 캐릭터 정보 */}
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
      </div>

      {/* 드래그 힌트 */}
      {isDraggable && !isInParty && (
        <div className="absolute inset-0 rounded-xl bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
          <span className="text-indigo-400 text-xs font-medium bg-[#0f0f1a]/80 px-2 py-1 rounded-lg">
            드래그하여 파티에 추가
          </span>
        </div>
      )}
    </div>
  );
}

