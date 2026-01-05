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
        마비노기 모바일 파티 구성을 쉽게 도와주는 페이지입니다.
        <br />
        여러 계정의 다수의 캐릭터들을 충돌 없이 배치해야 할 때 유용합니다.
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

