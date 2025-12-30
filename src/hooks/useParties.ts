import { useState, useCallback } from "react";
import type { Character, Party, PartyCondition } from "../types";
import { PARTY_SIZE } from "../constants/classes";

interface UsePartiesOptions {
  showToast: (message: string, type: "error" | "success") => void;
  characters: Character[];
  isCharacterInAnyParty: (characterId: string) => boolean;
}

export function useParties({
  showToast,
  characters,
  isCharacterInAnyParty,
}: UsePartiesOptions) {
  const [parties, setParties] = useState<Party[]>([]);

  // 파티 생성
  const handleCreateParty = useCallback(() => {
    const newParty: Party = {
      id: `party-${Date.now()}`,
      name: `파티 ${parties.length + 1}`,
      slots: Array(PARTY_SIZE).fill(null),
      conditions: [],
    };
    setParties((prev) => [...prev, newParty]);
  }, [parties.length]);

  // 파티 삭제
  const handleRemoveParty = useCallback((partyId: string) => {
    setParties((prev) => prev.filter((p) => p.id !== partyId));
  }, []);

  // 파티 이름 변경
  const handleUpdatePartyName = useCallback((partyId: string, name: string) => {
    setParties((prev) =>
      prev.map((p) => (p.id === partyId ? { ...p, name } : p))
    );
  }, []);

  // 파티 조건 업데이트
  const handleUpdatePartyConditions = useCallback(
    (partyId: string, conditions: PartyCondition[]) => {
      setParties((prev) =>
        prev.map((p) => (p.id === partyId ? { ...p, conditions } : p))
      );
    },
    []
  );

  // 캐릭터를 파티에 드롭
  const handleDropCharacter = useCallback(
    (partyId: string, slotIndex: number, character: Character) => {
      const party = parties.find((p) => p.id === partyId);
      if (!party) return;

      // 같은 계정의 다른 캐릭터가 이미 파티에 있는지 확인
      const existingAccountCharacter = party.slots.find(
        (slot) =>
          slot !== null &&
          slot.accountName === character.accountName &&
          slot.id !== character.id
      );

      if (existingAccountCharacter) {
        showToast(
          `이미 같은 계정(${character.accountName})의 캐릭터가 이 파티에 있습니다!`,
          "error"
        );
        return;
      }

      // 해당 슬롯에 이미 캐릭터가 있으면 교체
      setParties((prev) =>
        prev.map((p) => {
          if (p.id !== partyId) return p;

          // 같은 캐릭터가 이미 다른 슬롯에 있다면 제거
          const newSlots = p.slots.map((slot) =>
            slot?.id === character.id ? null : slot
          );

          // 지정된 슬롯에 캐릭터 배치
          newSlots[slotIndex] = character;

          return { ...p, slots: newSlots };
        })
      );
    },
    [parties, showToast]
  );

  // 파티에서 캐릭터 제거
  const handleRemoveFromParty = useCallback(
    (partyId: string, slotIndex: number) => {
      setParties((prev) =>
        prev.map((p) => {
          if (p.id !== partyId) return p;
          const newSlots = [...p.slots];
          newSlots[slotIndex] = null;
          return { ...p, slots: newSlots };
        })
      );
    },
    []
  );

  // 자동 파티 생성
  const handleAutoAssign = useCallback(() => {
    if (parties.length === 0) {
      showToast("먼저 파티를 생성해주세요!", "error");
      return;
    }

    const availableChars = characters.filter(
      (char) => !isCharacterInAnyParty(char.id)
    );

    if (availableChars.length === 0) {
      showToast("배치 가능한 캐릭터가 없습니다!", "error");
      return;
    }

    // 전투력 순으로 정렬 (높은 순)
    const sortedChars = [...availableChars].sort((a, b) => b.power - a.power);

    // 새로운 파티 상태 복사
    const newParties = parties.map((p) => ({
      ...p,
      slots: [...p.slots],
    }));

    // 사용된 캐릭터 추적
    const usedCharIds = new Set<string>();

    // 1단계: 조건이 있는 파티에 조건을 만족시키는 캐릭터 우선 배치
    for (const party of newParties) {
      if (party.conditions.length === 0) continue;

      // 파티에 이미 있는 계정 추적
      const usedAccounts = new Set(
        party.slots.filter((s) => s !== null).map((s) => s!.accountName)
      );

      for (const condition of party.conditions) {
        // 현재 조건 충족 수 계산
        const currentCount = party.slots.filter(
          (slot) => slot && condition.classNames.includes(slot.className)
        ).length;

        const needed = condition.minCount - currentCount;
        if (needed <= 0) continue;

        // 조건에 맞는 캐릭터 찾기
        const matchingChars = sortedChars.filter(
          (char) =>
            condition.classNames.includes(char.className) &&
            !usedCharIds.has(char.id) &&
            !usedAccounts.has(char.accountName)
        );

        let filled = 0;
        for (const char of matchingChars) {
          if (filled >= needed) break;

          // 빈 슬롯 찾기
          const emptySlotIndex = party.slots.findIndex((s) => s === null);
          if (emptySlotIndex === -1) break;

          party.slots[emptySlotIndex] = char;
          usedCharIds.add(char.id);
          usedAccounts.add(char.accountName);
          filled++;
        }
      }
    }

    // 2단계: 남은 캐릭터를 빈 슬롯에 배치 (전투력 순)
    const remainingChars = sortedChars.filter(
      (char) => !usedCharIds.has(char.id)
    );

    for (const char of remainingChars) {
      // 빈 슬롯이 있는 파티 찾기 (같은 계정이 없는 파티)
      for (const party of newParties) {
        const usedAccounts = new Set(
          party.slots.filter((s) => s !== null).map((s) => s!.accountName)
        );

        if (usedAccounts.has(char.accountName)) continue;

        const emptySlotIndex = party.slots.findIndex((s) => s === null);
        if (emptySlotIndex === -1) continue;

        party.slots[emptySlotIndex] = char;
        usedCharIds.add(char.id);
        break;
      }
    }

    setParties(newParties);

    const assignedCount = usedCharIds.size;
    if (assignedCount > 0) {
      showToast(`${assignedCount}명의 캐릭터가 자동 배치되었습니다!`, "success");
    } else {
      showToast("배치할 수 있는 캐릭터가 없습니다.", "error");
    }
  }, [parties, characters, isCharacterInAnyParty, showToast]);

  return {
    parties,
    handleCreateParty,
    handleRemoveParty,
    handleUpdatePartyName,
    handleUpdatePartyConditions,
    handleDropCharacter,
    handleRemoveFromParty,
    handleAutoAssign,
  };
}

