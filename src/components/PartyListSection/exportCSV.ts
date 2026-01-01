import type { Character, Party } from "../../types";

export function exportToCSV(parties: Party[]) {
  const rows: string[][] = [];
  const charsPerRow = 4; // 한 행에 4명씩

  parties.forEach((party, partyIndex) => {
    const filledSlots = party.slots.filter((slot): slot is Character => slot !== null);
    
    // 캐릭터를 charsPerRow 단위로 나눔
    for (let i = 0; i < filledSlots.length; i += charsPerRow) {
      const row: string[] = [];
      
      // 첫 번째 행에만 파티명 추가
      if (i === 0) {
        row.push(party.name);
      } else {
        row.push("");
      }

      // 해당 행의 캐릭터들 추가 (이름, 직업)
      const charsInRow = filledSlots.slice(i, i + charsPerRow);
      charsInRow.forEach((char) => {
        row.push(char.characterName);
        row.push(char.className);
      });

      rows.push(row);
    }

    // 빈 캐릭터가 없는 경우에도 파티명은 표시
    if (filledSlots.length === 0) {
      rows.push([party.name]);
    }

    // 파티 사이에 빈 행 추가 (마지막 파티 제외)
    if (partyIndex < parties.length - 1) {
      rows.push([]);
    }
  });

  // CSV 문자열 생성
  const csvContent = rows.map((row) => row.join(",")).join("\n");
  
  // BOM 추가 (한글 인코딩)
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  
  // 다운로드
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `파티목록_${new Date().toLocaleDateString("ko-KR")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

