import { useState, useCallback, useMemo } from "react";
import type { Character, Party } from "../types";

interface UseCharactersOptions {
  showToast: (message: string, type: "error" | "success") => void;
  parties: Party[];
}

export function useCharacters({ showToast, parties }: UseCharactersOptions) {
  const [characters, setCharacters] = useState<Character[]>([]);

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

  // 파티에 배치된 캐릭터인지 확인
  const isCharacterInAnyParty = useCallback(
    (characterId: string) => {
      return parties.some((party) =>
        party.slots.some((slot) => slot?.id === characterId)
      );
    },
    [parties]
  );

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
    characters,
    availableCharacters,
    groupedCharacters,
    handleAddCharacter,
    handleRemoveCharacter,
    isCharacterInAnyParty,
    isAccountFullyAssigned,
  };
}

