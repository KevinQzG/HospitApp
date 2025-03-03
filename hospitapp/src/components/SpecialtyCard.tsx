import { LucideIcon } from "lucide-react";

interface Props {
  name: string;
  icon: LucideIcon;
  active?: boolean;
}

export default function SpecialtyCard({ name, icon: Icon, active = false }: Props) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg flex flex-col items-center transition-all duration-300 ${
        active ? "bg-blue-500 text-white shadow-xl" : "bg-white hover:shadow-2xl"
      }`}
    >
      <Icon className={`w-10 h-10 ${active ? "text-white" : "text-blue-500"}`} />
      <h4 className="text-lg font-bold mt-3">{name}</h4>
    </div>
  );
}
