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
      "MICROBIOLOGÍA",
      "INMUNOLOGÍA",
    ],
  },
  {
    category: "Terapias",
    specialties: [
      "FISIOTERAPIA",
      "TERAPIA RESPIRATORIA",
      "LOGOPEDIA Y FONIATRÍA",
      "TERAPIA OCUPACIONAL",
      "FONOAUDIOLOGÍA",
      "MEDICINA FÍSICA Y REHABILITACIÓN",
    ],
  },
  {
    category: "Cardiología",
    specialties: [
      "CARDIOLOGÍA",
      "CIRUGÍA CARDIOVASCULAR",
      "CIRUGÍA CARDIOTORÁCICA",
      "CIRUGÍA CARDIOVASCULAR MÍNIMAMENTE INVASIVA",
      "CIRUGÍA ROBÓTICA DEL CORAZÓN",
      "CIRUGÍA CARDIACA PEDIÁTRICA",
    ],
  },
  {
    category: "Neurología",
    specialties: [
      "NEUROLOGÍA",
      "CIRUGÍA NEUROLÓGICA",
      "CIRUGÍA NEUROLÓGICA PEDIÁTRICA",
      "CIRUGÍA DE TRAUMA NEUROLÓGICO",
      "CIRUGÍA DEL DOLOR",
      "CIRUGÍA FUNCIONAL DEL SISTEMA NERVIOSO",
      "CIRUGÍA DE PARKINSON",
      "CIRUGÍA DE EPILEPSIA",
      "CIRUGÍA DE TUMORES CEREBRALES",
      "CIRUGÍA DE NEUROLOGÍA INFANTIL",
      "CIRUGÍA DE NEUROLOGÍA FUNCIONAL",
    ],
  },
  {
    category: "Cirugía",
    specialties: [
      "CIRUGÍA GENERAL",
      "CIRUGÍA PLÁSTICA",
      "CIRUGÍA CARDIOVASCULAR",
      "CIRUGÍA PEDIÁTRICA",
      "CIRUGÍA ONCOLÓGICA",
      "CIRUGÍA DE MANO",
      "CIRUGÍA ORTOPÉDICA",
      "CIRUGÍA TORÁCICA",
      "CIRUGÍA MAXILOFACIAL",
      "CIRUGÍA DE CABEZA Y CUELLO",
      "CIRUGÍA BARIÁTRICA",
      "CIRUGÍA HEPATOBILIAR",
      "CIRUGÍA DE COLUMNA",
      "CIRUGÍA ROBÓTICA",
      "CIRUGÍA TRAUMATOLÓGICA",
      "CIRUGÍA LAPAROSCÓPICA",
      "CIRUGÍA VASCULAR",
      "CIRUGÍA RECONSTRUCTIVA",
      "CIRUGÍA NEONATAL",
      "CIRUGÍA GINECOLÓGICA",
      "CIRUGÍA ENDOSCÓPICA",
      "CIRUGÍA DIGESTIVA",
      "CIRUGÍA DE MAMA",
      "CIRUGÍA ONCOGINECOLÓGICA",
      "CIRUGÍA DERMATOLÓGICA",
      "CIRUGÍA CRANEOMAXILOFACIAL",
      "CIRUGÍA COLOPROCTOLÓGICA",
      "CIRUGÍA DE TRASPLANTES",
      "CIRUGÍA DE PÁRPADOS",
      "CIRUGÍA ABDOMINAL",
      "CIRUGÍA PEDIÁTRICA MINIMAMENTE INVASIVA",
      "CIRUGÍA PLÁSTICA RECONSTRUCTIVA",
      "CIRUGÍA PLÁSTICA ESTÉTICA",
      "CIRUGÍA ARTROSCÓPICA",
      "CIRUGÍA FUNCIONAL",
      "CIRUGÍA METABÓLICA",
      "CIRUGÍA DE PIE Y TOBILLO",
      "CIRUGÍA ORTOPÉDICA DE MANO",
      "CIRUGÍA ORTOPÉDICA DE RODILLA",
      "CIRUGÍA ORTOPÉDICA DE HOMBRO",
      "CIRUGÍA ORTOPÉDICA DE CADERA",
      "CIRUGÍA ORTOPÉDICA DE COLUMNA",
      "CIRUGÍA ORTOPÉDICA INFANTIL",
      "CIRUGÍA TORÁCICA ONCOLÓGICA",
      "CIRUGÍA TRAUMATOLÓGICA PEDIÁTRICA",
      "CIRUGÍA UROLÓGICA",
      "CIRUGÍA UROLÓGICA ONCOLÓGICA",
      "CIRUGÍA UROLÓGICA INFANTIL",
      "CIRUGÍA OTORRINOLARINGOLÓGICA",
      "CIRUGÍA ORTOPÉDICA DEPORTIVA",
      "CIRUGÍA TRAUMATOLÓGICA DEPORTIVA",
      "CIRUGÍA GENERAL MÍNIMAMENTE INVASIVA",
      "CIRUGÍA GASTROINTESTINAL",
      "CIRUGÍA DEL APARATO DIGESTIVO",
      "CIRUGÍA DIGESTIVA Y METABÓLICA",
      "CIRUGÍA TORÁCICA MÍNIMAMENTE INVASIVA",
      "CIRUGÍA NEONATAL MÍNIMAMENTE INVASIVA",
      "CIRUGÍA ONCOLOGÍA TORÁCICA",
      "CIRUGÍA ONCOLOGÍA GASTROINTESTINAL",
      "CIRUGÍA ONCOLOGÍA MAMARIA",
      "CIRUGÍA ORTOPÉDICA AVANZADA",
      "CIRUGÍA PLÁSTICA Y ESTÉTICA",
      "CIRUGÍA ENDOVASCULAR",
      "CIRUGÍA DE COLUMNA MÍNIMAMENTE INVASIVA",
      "CIRUGÍA DE CIRUGÍA VASCULAR MÍNIMAMENTE INVASIVA",
      "CIRUGÍA ROBÓTICA DE COLUMNA",
      "CIRUGÍA ORTOPÉDICA ROBOTIZADA",
      "CIRUGÍA CARDIOTORÁCICA PEDIÁTRICA",
      "CIRUGÍA CARDIOVASCULAR ROBOTIZADA",
      "CIRUGÍA RECONSTRUCTIVA PEDIÁTRICA",
      "CIRUGÍA ORTOPÉDICA ONCOLÓGICA",
      "CIRUGÍA ORTOPÉDICA TRAUMATOLÓGICA",
      "CIRUGÍA ORTOPÉDICA TRAUMATOLÓGICA PEDIÁTRICA",
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
      "ALERGOLOGÍA",
      "GENÉTICA MÉDICA",
      "MEDICINA LABORAL",
      "MEDICINA DEL DEPORTE",
      "MEDICINA FAMILIAR",
      "GERIATRÍA",
      "MEDICINA PALIATIVA",
      "MEDICINA ESTÉTICA",
      "TOXICOLOGÍA",
    ],
  },
  {
    category: "Pediatría",
    specialties: [
      "PEDIATRÍA",
      "CIRUGÍA PEDIÁTRICA",
      "CIRUGÍA NEONATAL",
      "CIRUGÍA PEDIÁTRICA MINIMAMENTE INVASIVA",
      "CIRUGÍA UROLÓGICA INFANTIL",
      "CIRUGÍA NEUROLÓGICA PEDIÁTRICA",
      "CIRUGÍA CARDIOTORÁCICA PEDIÁTRICA",
      "CIRUGÍA RECONSTRUCTIVA PEDIÁTRICA",
      "CIRUGÍA ORTOPÉDICA INFANTIL",
      "CIRUGÍA TRAUMATOLÓGICA PEDIÁTRICA",
    ],
  },
  {
    category: "Ginecología y Obstetricia",
    specialties: [
      "GINECOLOGÍA Y OBSTETRICIA",
      "CIRUGÍA GINECOLÓGICA",
      "CIRUGÍA ONCOGINECOLÓGICA",
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
      "ODONTOLOGÍA",
      "NUTRICIÓN",
      "URGENCIAS",
      "GESTIÓN PRE-TRANSFUSIONAL",
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
            <Search className="absolute left-3 text-gray-400" size={20} /> {/* Ícono de lupa */}
          </div>
        </div>
      </div>

      {/* Specialties Grid */}
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