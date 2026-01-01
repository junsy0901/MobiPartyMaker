import type { ClassName } from "../../types";
import { getClassImagePath } from "../../constants/classes";

interface ClassImageProps {
  className: ClassName;
  isInParty?: boolean;
}

export function ClassImage({ className, isInParty = false }: ClassImageProps) {
  return (
    <div className="relative">
      <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[#2d2d44] shadow-lg">
        <img
          src={getClassImagePath(className)}
          alt={className}
          className="w-full h-full object-cover"
        />
      </div>
      {isInParty && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

