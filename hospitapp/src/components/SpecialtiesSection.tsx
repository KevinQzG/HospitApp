import { Stethoscope, HeartPulse, Pill, Brain, Bone, User, Hospital, ClipboardList, Syringe, Candy } from "lucide-react";
import SpecialtyCard from "@/components/SpecialtyCard";

export default function SpecialtiesSection() {
  const _SPECIALTIES = [
    { name: "Odontología", icon: Candy },
    { name: "Diagnóstico General", icon: Syringe },
    { name: "Neurología", icon: Brain },
    { name: "Cardiología", icon: HeartPulse },
    { name: "Nutrición", icon: Pill },
    { name: "Ortopedia", icon: Bone },
    { name: "Endocrinología", icon: Stethoscope },
    { name: "Psicología", icon: User },
    { name: "Urgencias", icon: Hospital },
  ];

  return (
    <section className="py-12 sm:py-16 text-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Algunas especialidades</h3>
        <p className="text-sm sm:text-base text-gray-500 mt-2">
          Encuentra atención especializada en diferentes áreas de la salud.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {_SPECIALTIES.map((specialty, index) => (
            <SpecialtyCard key={index} name={specialty.name} icon={specialty.icon} />
          ))}
        </div>
      </div>
    </section>
  );
}