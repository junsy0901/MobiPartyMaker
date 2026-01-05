import { useState, useCallback, useMemo } from "react";
import type { Character, Party, PartyCondition, TimeSlot, AccountTimeSlots } from "../types";
import { generateTimeSlots } from "../types";
import { PARTY_SIZE } from "../constants/classes";

interface Toast {
  message: string;
  type: "error" | "success";
}

export function usePartyMaker() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  
  // 시간 모드 상태
  const [isTimeMode, setIsTimeMode] = useState(false);
  const [accountTimeSlots, setAccountTimeSlots] = useState<AccountTimeSlots>({});
  const [startHour, setStartHour] = useState<number>(8);
  const [endHour, setEndHour] = useState<number>(12);
  const selectedTimeSlots = generateTimeSlots(startHour, endHour);

  // 토스트 메시지 표시
  const showToast = useCallback(
    (message: string, type: "error" | "success" = "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  // 시간 모드 토글
  const handleToggleTimeMode = useCallback((enabled: boolean) => {
    setIsTimeMode(enabled);
    
    if (enabled) {
      // 시간 모드 활성화: 설정된 시간대로 파티 자동 생성
      const timeSlots = generateTimeSlots(startHour, endHour);
      const timeParties: Party[] = timeSlots.map((hour) => ({
        id: `time-party-${hour}-${Date.now()}`,
        name: `${hour}시`,
        slots: Array(PARTY_SIZE).fill(null),
        conditions: [],
        timeSlot: hour,
      }));
      setParties(timeParties);
    } else {
      // 시간 모드 비활성화: 기존 파티 초기화
      setParties([]);
    }
  }, [startHour, endHour]);

  // 시간 범위 업데이트 (자정을 넘기는 경우도 지원: 21시~2시)
  const handleUpdateTimeRange = useCallback((newStartHour: number, newEndHour: number) => {
    // 0~23 범위로 제한
    const validStart = Math.max(0, Math.min(23, newStartHour));
    const validEnd = Math.max(0, Math.min(23, newEndHour));
    
    setStartHour(validStart);
    setEndHour(validEnd);
    
    // 시간 모드가 활성화되어 있으면 파티도 업데이트
    if (isTimeMode) {
      const timeSlots = generateTimeSlots(validStart, validEnd);
      const timeParties: Party[] = timeSlots.map((hour) => ({
        id: `time-party-${hour}-${Date.now()}`,
        name: `${hour}시`,
        slots: Array(PARTY_SIZE).fill(null),
        conditions: [],
        timeSlot: hour,
      }));
      setParties(timeParties);
    }
  }, [isTimeMode]);

  // 계정의 가능 시간 업데이트
  const handleUpdateAccountTimeSlots = useCallback(
    (accountName: string, timeSlots: TimeSlot[]) => {
      setAccountTimeSlots((prev) => ({
        ...prev,
        [accountName]: timeSlots,
      }));
    },
    []
  );

  // 계정이 특정 시간대에 가능한지 확인
  const isAccountAvailableAt = useCallback(
    (accountName: string, timeSlot: TimeSlot) => {
      const slots = accountTimeSlots[accountName];
      // 시간 설정이 없으면 모든 시간 가능 (기본값)
      if (!slots || slots.length === 0) return true;
      return slots.includes(timeSlot);
    },
    [accountTimeSlots]
  );

  // 파티에 배치된 캐릭터인지 확인
  const isCharacterInAnyParty = useCallback(
    (characterId: string) => {
      return parties.some((party) =>
        party.slots.some((slot) => slot?.id === characterId)
      );
    },
    [parties]
  );

  // 캐릭터 추가
  const handleAddCharacter = useCallback(
    (character: Character) => {
      // 중복 체크: 같은 계정명 + 같은 캐릭터명
      const isDuplicate = characters.some(
        (c) =>
          c.accountName === character.accountName &&
          c.characterName === character.characterName
      );

      if (isDuplicate) {
        showToast(
          `이미 등록된 캐릭터입니다: ${character.accountName} - ${character.characterName}`,
          "error"
        );
        return;
      }

      setCharacters((prev) => [...prev, character]);
      showToast(
        `${character.characterName} 캐릭터가 등록되었습니다!`,
        "success"
      );
    },
    [characters, showToast]
  );

  // 캐릭터 삭제 (리스트에서)
  const handleRemoveCharacter = useCallback((characterId: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== characterId));
  }, []);

  // 모든 캐릭터 초기화
  const handleClearAllCharacters = useCallback(() => {
    setCharacters([]);
    setAccountTimeSlots({});
    // 파티 슬롯도 모두 비우기
    setParties((prev) =>
      prev.map((p) => ({
        ...p,
        slots: Array(p.slots.length).fill(null),
      }))
    );
    showToast("모든 신청자가 초기화되었습니다.", "success");
  }, [showToast]);

  // 파티 생성 (시간 모드일 때는 시간대 지정 필요)
  const handleCreateParty = useCallback((timeSlot?: TimeSlot) => {
    setParties((prev) => {
      if (isTimeMode && timeSlot) {
        // 시간 모드: 해당 시간대의 파티 개수 계산
        const sameTimeParties = prev.filter((p) => p.timeSlot === timeSlot);
        const newParty: Party = {
          id: `time-party-${timeSlot}-${Date.now()}`,
          name: `${timeSlot}시 (${sameTimeParties.length + 1})`,
          slots: Array(PARTY_SIZE).fill(null),
          conditions: [],
          timeSlot,
        };
        // 같은 시간대 파티들 뒤에 삽입
        const insertIndex = prev.findIndex((p) => p.timeSlot && p.timeSlot > timeSlot);
        if (insertIndex === -1) {
          return [...prev, newParty];
        }
        return [...prev.slice(0, insertIndex), newParty, ...prev.slice(insertIndex)];
      } else {
        // 일반 모드
        const newParty: Party = {
          id: `party-${Date.now()}`,
          name: `파티 ${prev.length + 1}`,
          slots: Array(PARTY_SIZE).fill(null),
          conditions: [],
        };
        return [...prev, newParty];
      }
    });
  }, [isTimeMode]);

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

  // 캐릭터를 파티에 드롭 (스왑 지원)
  const handleDropCharacter = useCallback(
    (partyId: string, slotIndex: number, character: Character) => {
      const targetParty = parties.find((p) => p.id === partyId);
      if (!targetParty) return;

      // 시간 모드에서 시간 제한 체크
      if (isTimeMode && targetParty.timeSlot) {
        const slots = accountTimeSlots[character.accountName];
        // 시간 설정이 있고, 해당 시간에 가능하지 않은 경우
        if (slots && slots.length > 0 && !slots.includes(targetParty.timeSlot)) {
          showToast(
            `${character.accountName} 계정은 ${targetParty.timeSlot}시에 참여할 수 없습니다!`,
            "error"
          );
          return;
        }
      }

      // 드래그한 캐릭터의 원래 위치 찾기
      let sourcePartyId: string | null = null;
      let sourceSlotIndex: number | null = null;
      for (const p of parties) {
        const idx = p.slots.findIndex((s) => s?.id === character.id);
        if (idx !== -1) {
          sourcePartyId = p.id;
          sourceSlotIndex = idx;
          break;
        }
      }

      // 대상 슬롯에 있는 캐릭터
      const targetSlotCharacter = targetParty.slots[slotIndex];

      // 같은 위치에 드롭한 경우 무시
      if (sourcePartyId === partyId && sourceSlotIndex === slotIndex) {
        return;
      }

      // 스왑 시 같은 계정 체크
      if (targetSlotCharacter) {
        // 동일 파티 내 스왑인 경우: 계정 체크 불필요 (이미 같은 파티에 있으므로)
        const isSamePartySwap = sourcePartyId === partyId;

        if (!isSamePartySwap) {
          // 드래그한 캐릭터가 대상 파티로 이동할 때 같은 계정 체크
          // (대상 슬롯의 캐릭터와 드래그한 캐릭터 자신은 제외)
          const sameAccountInTargetParty = targetParty.slots.find(
            (slot) =>
              slot !== null &&
              slot.id !== targetSlotCharacter.id &&
              slot.id !== character.id &&
              slot.accountName === character.accountName
          );

          if (sameAccountInTargetParty) {
            showToast(
              `이미 같은 계정(${character.accountName})의 캐릭터가 이 파티에 있습니다!`,
              "error"
            );
            return;
          }

          // 대상 슬롯의 캐릭터가 소스 파티로 이동할 때 같은 계정 체크
          if (sourcePartyId) {
            const sourceParty = parties.find((p) => p.id === sourcePartyId);
            if (sourceParty) {
              const sameAccountInSourceParty = sourceParty.slots.find(
                (slot) =>
                  slot !== null &&
                  slot.id !== character.id &&
                  slot.id !== targetSlotCharacter.id &&
                  slot.accountName === targetSlotCharacter.accountName
              );

              if (sameAccountInSourceParty) {
                showToast(
                  `같은 계정(${targetSlotCharacter.accountName})의 캐릭터가 원래 파티에 있어 스왑할 수 없습니다!`,
                  "error"
                );
                return;
              }
            }
          }
        }
      } else {
        // 대상 슬롯이 비어있는 경우 기존 로직 (같은 계정 체크)
        const existingAccountCharacter = targetParty.slots.find(
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
      }

      setParties((prev) =>
        prev.map((p) => {
          const newSlots = [...p.slots];

          // 소스 파티에서 드래그한 캐릭터 제거 및 스왑 처리
          if (p.id === sourcePartyId && sourceSlotIndex !== null) {
            // 스왑: 대상 슬롯의 캐릭터를 소스 위치로 이동
            newSlots[sourceSlotIndex] = targetSlotCharacter || null;
          } else {
            // 다른 파티에서 드래그한 캐릭터 제거 (신청자 목록에서 온 경우 해당 없음)
            for (let i = 0; i < newSlots.length; i++) {
              if (newSlots[i]?.id === character.id) {
                newSlots[i] = null;
              }
            }
          }

          // 대상 파티에 드래그한 캐릭터 배치
          if (p.id === partyId) {
            newSlots[slotIndex] = character;
          }

          return { ...p, slots: newSlots };
        })
      );
    },
    [parties, showToast, isTimeMode, accountTimeSlots]
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

  // 모든 파티에서 캐릭터 제거 (파티 → 신청자 목록으로 드롭 시)
  const handleRemoveCharacterFromAllParties = useCallback(
    (characterId: string) => {
      setParties((prev) =>
        prev.map((p) => ({
          ...p,
          slots: p.slots.map((slot) =>
            slot?.id === characterId ? null : slot
          ),
        }))
      );
    },
    []
  );

  // 자동 파티 재배치 (모든 슬롯 초기화 후 재배치)
  const handleAutoAssign = useCallback(() => {
    if (parties.length === 0) {
      showToast("먼저 파티를 생성해주세요!", "error");
      return;
    }

    if (characters.length === 0) {
      showToast("배치할 캐릭터가 없습니다!", "error");
      return;
    }

    // 전투력 순으로 정렬 (높은 순)
    const sortedChars = [...characters].sort((a, b) => b.power - a.power);

    // 새로운 파티 상태 복사 (모든 슬롯 초기화)
    const newParties = parties.map((p) => ({
      ...p,
      slots: Array(p.slots.length).fill(null) as (typeof p.slots),
    }));

    // 사용된 캐릭터 추적 (시간 모드에서는 시간대별로 추적)
    const usedCharIds = new Set<string>();
    // 시간 모드: 시간대별로 사용된 캐릭터 추적 (같은 시간대에는 같은 캐릭터 배치 불가)
    const usedCharIdsByTime: Record<TimeSlot, Set<string>> = {
      8: new Set(),
      9: new Set(),
      10: new Set(),
      11: new Set(),
      12: new Set(),
    };

    // 캐릭터가 특정 시간대에 가능한지 확인하는 헬퍼 함수
    const canAssignToTime = (char: Character, timeSlot: TimeSlot | undefined): boolean => {
      if (!isTimeMode || !timeSlot) return true;
      
      // 해당 시간대에 이미 배치된 캐릭터인지 확인
      if (usedCharIdsByTime[timeSlot].has(char.id)) return false;
      
      // 계정의 가능 시간 확인
      const slots = accountTimeSlots[char.accountName];
      if (!slots || slots.length === 0) return true; // 설정 없으면 모든 시간 가능
      return slots.includes(timeSlot);
    };

    // 1단계: 조건이 있는 파티에 조건을 만족시키는 캐릭터 우선 배치
    for (const party of newParties) {
      if (party.conditions.length === 0) continue;

      // 파티에 배치된 계정 추적
      const usedAccounts = new Set<string>();

      for (const condition of party.conditions) {
        // 조건에 맞는 캐릭터 찾기 (시간 조건 포함)
        const matchingChars = sortedChars.filter(
          (char) =>
            condition.classNames.includes(char.className) &&
            !usedAccounts.has(char.accountName) &&
            canAssignToTime(char, party.timeSlot)
        );

        let filled = 0;
        for (const char of matchingChars) {
          if (filled >= condition.minCount) break;

          // 빈 슬롯 찾기
          const emptySlotIndex = party.slots.findIndex((s) => s === null);
          if (emptySlotIndex === -1) break;

          party.slots[emptySlotIndex] = char;
          usedCharIds.add(char.id);
          usedAccounts.add(char.accountName);
          if (party.timeSlot) {
            usedCharIdsByTime[party.timeSlot].add(char.id);
          }
          filled++;
        }
      }
    }

    // 2단계: 남은 캐릭터를 빈 슬롯에 배치 (전투력 순)
    for (const char of sortedChars) {
      // 빈 슬롯이 있는 파티 찾기 (같은 계정이 없는 파티)
      for (const party of newParties) {
        // 시간 조건 확인
        if (!canAssignToTime(char, party.timeSlot)) continue;

        const usedAccounts = new Set(
          party.slots.filter((s) => s !== null).map((s) => s!.accountName)
        );

        if (usedAccounts.has(char.accountName)) continue;

        const emptySlotIndex = party.slots.findIndex((s) => s === null);
        if (emptySlotIndex === -1) continue;

        party.slots[emptySlotIndex] = char;
        usedCharIds.add(char.id);
        if (party.timeSlot) {
          usedCharIdsByTime[party.timeSlot].add(char.id);
        }
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
  }, [parties, characters, showToast, isTimeMode, accountTimeSlots]);

  // 배치되지 않은 캐릭터만 필터링
  const availableCharacters = useMemo(
    () => characters.filter((char) => !isCharacterInAnyParty(char.id)),
    [characters, isCharacterInAnyParty]
  );

  // 계정별로 캐릭터 그룹화
  const groupedCharacters = useMemo(
    () =>
      characters.reduce((acc, char) => {
        if (!acc[char.accountName]) {
          acc[char.accountName] = [];
        }
        acc[char.accountName].push(char);
        return acc;
      }, {} as Record<string, Character[]>),
    [characters]
  );

  // 그룹 내 모든 캐릭터가 파티에 배치되었는지 확인
  const isAccountFullyAssigned = useCallback(
    (accountName: string) => {
      const accountChars = groupedCharacters[accountName];
      return accountChars.every((char) => isCharacterInAnyParty(char.id));
    },
    [groupedCharacters, isCharacterInAnyParty]
  );

  return {
    // State
    toast,
    characters,
    parties,
    availableCharacters,
    groupedCharacters,

    // 시간 모드 상태
    isTimeMode,
    accountTimeSlots,
    selectedTimeSlots,
    startHour,
    endHour,

    // Character actions
    handleAddCharacter,
    handleRemoveCharacter,
    handleClearAllCharacters,
    isCharacterInAnyParty,
    isAccountFullyAssigned,

    // Party actions
    handleCreateParty,
    handleRemoveParty,
    handleUpdatePartyName,
    handleUpdatePartyConditions,
    handleDropCharacter,
    handleRemoveFromParty,
    handleRemoveCharacterFromAllParties,
    handleAutoAssign,

    // 시간 모드 actions
    handleToggleTimeMode,
    handleUpdateAccountTimeSlots,
    handleUpdateTimeRange,
    isAccountAvailableAt,

    // Toast
    showToast,
  };
}

