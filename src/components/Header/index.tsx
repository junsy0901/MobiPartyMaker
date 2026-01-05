import { TimeModeToggle } from "../TimeModeToggle";

interface HeaderProps {
  isTimeMode: boolean;
  startHour: number;
  endHour: number;
  onToggleTimeMode: (enabled: boolean) => void;
  onUpdateTimeRange: (startHour: number, endHour: number) => void;
}

export function Header({ 
  isTimeMode, 
  startHour,
  endHour,
  onToggleTimeMode, 
  onUpdateTimeRange 
}: HeaderProps) {
  return (
    <header className="text-center mb-6">
      <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
        ⚔️ 모비노기 파티 메이커
      </h1>
      <p className="text-gray-400 mb-4">
        캐릭터를 등록하고 드래그하여 파티를 구성하세요
      </p>
      
      <TimeModeToggle
        isTimeMode={isTimeMode}
        startHour={startHour}
        endHour={endHour}
        onToggle={onToggleTimeMode}
        onUpdateTimeRange={onUpdateTimeRange}
      />
    </header>
  );
}

