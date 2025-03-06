import { Stethoscope, HeartPulse, Pill, Brain, Bone, User, Hospital, ClipboardList, Syringe, Candy } from "lucide-react";
import SpecialtyCard from "@/components/SpecialtyCard";

export default function SpecialtiesSection() {
  return (
    <section className="py-12 sm:py-16 text-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Algunas especialidades</h3>
        <p className="text-sm sm:text-base text-gray-500 mt-2">
          Encuentra atención especializada en diferentes áreas de la salud.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <SpecialtyCard name="Odontología" icon={Candy} />
          <SpecialtyCard name="Diagnóstico General" icon={Syringe} />
          <SpecialtyCard name="Neurología" icon={Brain} />
          <SpecialtyCard name="Cardiología" icon={HeartPulse} />
          <SpecialtyCard name="Nutrición" icon={Pill} />
          <SpecialtyCard name="Ortopedia" icon={Bone} />
          <SpecialtyCard name="Endocrinología" icon={Stethoscope} />
          <SpecialtyCard name="Psicología" icon={User} />
          <SpecialtyCard name="Urgencias" icon={Hospital} />
        </div>
      </div>
    </section>
  );
}