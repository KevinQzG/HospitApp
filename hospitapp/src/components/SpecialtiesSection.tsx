import { Stethoscope, HeartPulse, Pill, Brain, Bone, User, Hospital, ClipboardList, Syringe } from "lucide-react";
import SpecialtyCard from "@/components/SpecialtyCard";

export default function SpecialtiesSection() {
  return (
    <section className="py-16 text-center">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-800">Algunas especialidades</h3>
        <p className="text-gray-500">Encuentra atención especializada en diferentes áreas de la salud.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-8">
          <SpecialtyCard name="Odontología" icon={Pill} />
          <SpecialtyCard name="Diagnóstico General" icon={Syringe} active />
          <SpecialtyCard name="Neurología" icon={Brain} />
          <SpecialtyCard name="Cardiología" icon={HeartPulse} />
          <SpecialtyCard name="Nutrición" icon={Pill} />
          <SpecialtyCard name="Ortopedia" icon={Bone} />
          <SpecialtyCard name="Endocrinología" icon={Stethoscope} />
          <SpecialtyCard name="Psicología" icon={User} />
          <SpecialtyCard name="+ Especialidades" icon={Hospital} />
        </div>
      </div>
    </section>
  );
}
