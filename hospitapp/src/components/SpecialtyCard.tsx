import { LucideIcon } from "lucide-react";

interface Props {
  name: string;
  icon: LucideIcon;
  active?: boolean;
}

export default function SpecialtyCard({ name, icon: Icon, active = false }: Props) {
  return (
    <div
      className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg flex flex-col items-center transition-all duration-300 ${
        active ? "bg-blue-500 text-white shadow-xl" : "bg-white hover:shadow-lg"
      }`}
    >
      <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${active ? "text-white" : "text-blue-500"}`} />
      <h4 className="text-base sm:text-lg font-bold mt-2 sm:mt-3">{name}</h4>
    </div>
  );
}