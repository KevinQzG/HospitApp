// components/SpecialtyCard.tsx
"use client";

import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  name: string;
  icon: LucideIcon;
  active?: boolean;
}

export default function SpecialtyCard({ name, icon: Icon, active = false }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/results?specialties=${encodeURIComponent(name)}`);
  };

  const _CARD_CLASSES = `
    group p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg 
    flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
    ${active
      ? "bg-blue-500 text-white shadow-xl"
      : "bg-white hover:bg-blue-500 hover:text-white hover:shadow-xl"
    }
  `;

  const _ICON_CLASSES = `
    w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-300 
    ${active ? "text-white" : "text-blue-500 group-hover:text-white"}
  `;

  return (
    <div className={_CARD_CLASSES} onClick={handleClick}>
      <Icon className={_ICON_CLASSES} />
      <h4 className="text-base sm:text-lg font-bold mt-2 sm:mt-3 text-center">{name}</h4>
    </div>
  );
}