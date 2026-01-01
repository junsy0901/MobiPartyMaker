import { useState } from 'react';
import type { Character } from '../types';
import { CharacterCard } from './CharacterCard';

interface PartySlotProps {
  index: number;
  character: Character | null;
  onDrop: (character: Character) => void;
  onRemove: () => void;
}

export function PartySlot({ index, character, onDrop, onRemove }: PartySlotProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = e.dataTransfer.getData('application/json');
      const droppedCharacter = JSON.parse(data) as Character;
      onDrop(droppedCharacter);
    } catch (error) {
      console.error('드롭 처리 중 오류 발생:', error);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative min-h-[100px] rounded-xl border-2 border-dashed transition-all duration-200
        ${character
          ? 'border-transparent bg-transparent p-0'
          : isDragOver
            ? 'border-indigo-400 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
            : 'border-[#2d2d44] bg-[#0f0f1a]/50 hover:border-[#3d3d54]'
        }
      `}
    >
      {character ? (
        <CharacterCard
          character={character}
          onRemove={onRemove}
          isDraggable={true}
          isInParty={true}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-6 px-4">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
            ${isDragOver ? 'bg-indigo-500/30 scale-110' : 'bg-[#1a1a2e]'}
          `}>
            <span className="text-2xl">{index + 1}</span>
          </div>
          <p className={`text-sm transition-colors ${isDragOver ? 'text-indigo-300' : 'text-gray-500'}`}>
            {isDragOver ? '여기에 드롭하세요' : '캐릭터를 드래그하세요'}
          </p>
        </div>
      )}

      {/* 드래그 오버 효과 */}
      {isDragOver && !character && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}

