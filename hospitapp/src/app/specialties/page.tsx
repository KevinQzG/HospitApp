"use client";

import { useState, useEffect } from "react";
import { Stethoscope, Search } from "lucide-react";
import SpecialtyCard from "@/components/SpecialtyCard";

const _SPECIALTIES = [
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
    specialties: [
      "NEUROLOGÍA",
      "NEUROCIRUGÍA",
      "NEUROPEDIATRÍA",
    ],
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
    specialties: [
      "PEDIATRÍA",
      "CIRUGÍA PEDIÁTRICA",
      "NEONATOLOGÍA", 
    ],
  },
  {
    category: "Ginecología y Obstetricia",
    specialties: [
      "GINECOBSTETRICIA", 
      "CIRUGÍA GINECOLÓGICA",
    ],
  },
  {
    category: "Psiquiatría y Psicología",
    specialties: [
      "PSIQUIATRÍA",
      "PSICOLOGÍA",
    ],
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSpecialties, setFilteredSpecialties] = useState(_SPECIALTIES);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const filtered = _SPECIALTIES.map((category) => ({
        ...category,
        specialties: category.specialties.filter((specialty) =>
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      })).filter((category) => category.specialties.length > 0);

      setFilteredSpecialties(filtered);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Especialidades Médicas</h1>
        <p className="text-gray-700 text-xl max-w-2xl mx-auto">
          Explora nuestra amplia gama de especialidades médicas disponibles en HospitAPP. Encuentra el servicio que necesitas de manera rápida y eficiente.
        </p>

        <div className="mt-6 relative max-w-md mx-auto">
          <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <input
              type="text"
              placeholder="Buscar especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 text-gray-700 rounded-lg focus:outline-none"
              aria-label="Buscar especialidad médica"
            />
            <Search className="absolute left-3 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10">
        {filteredSpecialties.map((category, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
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