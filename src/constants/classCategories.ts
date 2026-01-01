import type { ClassName } from "../types";

export interface ClassCategory {
  name: string;
  classes: ClassName[];
}

export const CLASS_CATEGORIES: ClassCategory[] = [
  {
    name: "전사 계열",
    classes: ["전사", "검술사", "대검전사"],
  },
  {
    name: "궁수 계열",
    classes: ["궁수", "석궁사수", "장궁병"],
  },
  {
    name: "힐러 계열",
    classes: ["힐러", "사제", "수도사", "암흑술사"],
  },
  {
    name: "음유시인 계열",
    classes: ["음유시인", "악사", "댄서"],
  },
  {
    name: "마법사 계열",
    classes: ["마법사", "화염술사", "빙결술사", "전격술사"],
  },
  {
    name: "도적 계열",
    classes: ["도적", "듀얼블레이드", "격투가"],
  },
];

