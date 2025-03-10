// components/SpecialtiesSection.tsx
"use client";

import {
  Stethoscope,
  HeartPulse,
  Brain,
  User,
  Hospital,
  Candy,
  Baby,
  Scissors,
  Pill,
} from "lucide-react";
import SpecialtyCard from "@/components/SpecialtyCard";

export default function SpecialtiesSection() {
  const _SPECIALTIES = [
    { name: "URGENCIAS", icon: Hospital },
    { name: "ENDOCRINOLOGÍA", icon: Pill },
    { name: "CARDIOLOGÍA", icon: HeartPulse },
    { name: "NEUROLOGÍA", icon: Brain },
    { name: "PSICOLOGÍA", icon: User },
    { name: "ODONTOLOGÍA GENERAL", icon: Candy },
    { name: "MEDICINA GENERAL", icon: Stethoscope },
    { name: "PEDIATRÍA", icon: Baby },
    { name: "CIRUGÍA GENERAL", icon: Scissors },
  ];

  return (
    <section className="py-12 sm:py-16 text-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Especialidades más buscadas
        </h3>
        <p className="text-sm sm:text-base text-gray-500 mt-2">
          No encuentras la especialidad que buscas?{" "}
          <a href="specialties" className="text-blue-500 hover:underline">
            Ver todas las especialidades
          </a>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {_SPECIALTIES.map((specialty, index) => (
            <SpecialtyCard
              key={index}
              name={specialty.name}
              icon={specialty.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
