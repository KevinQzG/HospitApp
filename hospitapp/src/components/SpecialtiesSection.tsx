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
  const SPECIALTIES = [
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
    <section className="py-12 sm:py-16 text-center px-4 sm:px-6 lg:px-8 bg-[#F9FCFF] dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          Especialidades más buscadas
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
          ¿No encuentras la especialidad que buscas?{" "}
          <a
            href="/specialties"
            className="text-blue-800 dark:text-blue-400 underline hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
          >
            Ver todas las especialidades
          </a>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {SPECIALTIES.map((specialty, index) => (
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
