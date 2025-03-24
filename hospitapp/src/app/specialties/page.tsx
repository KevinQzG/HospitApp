"use client";

import { useState, useEffect } from "react";
import { Stethoscope, Search } from "lucide-react";
import SpecialtyCard from "@/components/SpecialtyCard";
import { useRouter } from "next/navigation";

const SPECIALTIES = [
  {
    category: "Diagnóstico",
    specialties: [
      "DIAGNÓSTICO VASCULAR",
      "IMÁGENES DIAGNÓSTICAS - NO IONIZANTES",
      "LABORATORIO CLÍNICO",
      "TOMA DE MUESTRAS DE LABORATORIO CLÍNICO",
      "MEDICINA NUCLEAR",
      "INMUNOLOGÍA",
    ],
  },
  {
    category: "Terapias",
    specialties: [
      "FISIOTERAPIA",
      "TERAPIA RESPIRATORIA",
      "TERAPIA OCUPACIONAL",
      "FONOAUDIOLOGÍA Y/O TERAPIA DEL LENGUAJE",
      "MEDICINA FÍSICA Y REHABILITACIÓN",
    ],
  },
  {
    category: "Cardiología",
    specialties: [
      "CARDIOLOGÍA",
      "CIRUGÍA CARDIOVASCULAR",
      "CARDIOLOGÍA PEDIÁTRICA",
    ],
  },
  {
    category: "Neurología",
    specialties: ["NEUROLOGÍA", "NEUROCIRUGÍA", "NEUROPEDIATRÍA"],
  },
  {
    category: "Cirugía",
    specialties: [
      "CIRUGÍA GENERAL",
      "CIRUGÍA PLÁSTICA Y ESTÉTICA",
      "CIRUGÍA CARDIOVASCULAR",
      "CIRUGÍA PEDIÁTRICA",
      "CIRUGÍA ONCOLÓGICA",
      "CIRUGÍA DE MANO",
      "CIRUGÍA ORTOPÉDICA",
      "CIRUGÍA DE TÓRAX",
      "CIRUGÍA MAXILOFACIAL",
      "CIRUGÍA DE CABEZA Y CUELLO",
      "CIRUGÍA VASCULAR",
      "CIRUGÍA GINECOLÓGICA",
      "CIRUGÍA GASTROINTESTINAL",
      "CIRUGÍA DERMATOLÓGICA",
      "CIRUGÍA OTORRINOLARINGOLÓGICA",
      "CIRUGÍA UROLÓGICA",
    ],
  },
  {
    category: "Medicina Interna",
    specialties: [
      "MEDICINA INTERNA",
      "ENDOCRINOLOGÍA",
      "NEUMOLOGÍA",
      "GASTROENTEROLOGÍA",
      "NEFROLOGÍA",
      "HEMATOLOGÍA",
      "REUMATOLOGÍA",
      "MEDICINA FAMILIAR",
      "GERIATRÍA",
      "TOXICOLOGÍA",
    ],
  },
  {
    category: "Pediatría",
    specialties: ["PEDIATRÍA", "CIRUGÍA PEDIÁTRICA", "NEONATOLOGÍA"],
  },
  {
    category: "Ginecología y Obstetricia",
    specialties: ["GINECOBSTETRICIA", "CIRUGÍA GINECOLÓGICA"],
  },
  {
    category: "Psiquiatría y Psicología",
    specialties: ["PSIQUIATRÍA", "PSICOLOGÍA"],
  },
  {
    category: "Otras Especialidades",
    specialties: [
      "DERMATOLOGÍA",
      "OFTALMOLOGÍA",
      "UROLOGÍA",
      "ODONTOLOGÍA GENERAL",
      "NUTRICIÓN Y DIETÉTICA",
      "URGENCIAS",
      "SERVICIO FARMACÉUTICO",
    ],
  },
];

export default function SpecialtiesPage() {
  const [search_term, setSearchTerm] = useState("");
  const [filtered_specialties, setFilteredSpecialties] = useState(SPECIALTIES);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = SPECIALTIES.map((category) => ({
        ...category,
        specialties: category.specialties.filter((specialty) =>
          specialty.toLowerCase().includes(search_term.toLowerCase())
        ),
      })).filter((category) => category.specialties.length > 0);

      setFilteredSpecialties(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search_term]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (search_term) {
      const query_params = new URLSearchParams({
        specialties: search_term,
        coordinates: "-75.5849,6.1816",
        maxDistance: "20000",
        page: "1",
        pageSize: "21",
      });

      router.push(`/results?${query_params.toString()}`);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] dark:from-gray-900 dark:to-gray-950 py-20 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Especialidades Médicas
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
          Explora nuestra amplia gama de especialidades médicas disponibles en
          HospitAPP. Encuentra el servicio que necesitas de manera rápida y
          eficiente.
        </p>

        <div className="mt-8 max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative max-w-lg mx-auto w-full">
            <div className="flex items-center w-full bg-white dark:bg-gray-800 rounded-full shadow-md transition-shadow duration-300 border border-gray-300 dark:border-gray-700 focus-within:shadow-lg overflow-hidden">
              <Search className="absolute left-4 text-gray-400 dark:text-gray-300" size={18} />

              <input
                type="text"
                placeholder="Buscar especialidad..."
                value={search_term}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-12 pr-16 text-gray-700 dark:text-gray-100 bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-base"
                aria-label="Buscar especialidad médica"
              />

              <button
                type="submit"
                className="absolute right-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 text-sm font-medium"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10">
        {filtered_specialties.map((category, index) => (
          <div key={index} className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {category.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {category.specialties.map((specialty, idx) => (
                <SpecialtyCard key={idx} name={specialty} icon={Stethoscope} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
