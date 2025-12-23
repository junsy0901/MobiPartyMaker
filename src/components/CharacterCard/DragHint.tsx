interface DragHintProps {
  isDraggable: boolean;
  isInParty: boolean;
}

export function DragHint({ isDraggable, isInParty }: DragHintProps) {
  if (!isDraggable || isInParty) {
    return null;
  }

  return (
    <div className="absolute inset-0 rounded-xl bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
      <span className="text-indigo-400 text-xs font-medium bg-[#0f0f1a]/80 px-2 py-1 rounded-lg">
        드래그하여 파티에 추가
      </span>
    </div>
  );
}

