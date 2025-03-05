import Image from "next/image";
import SpecialtiesSection from "@/components/SpecialtiesSection";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section BG #ECF6FF */}
      <section className="relative bg-[#ECF6FF] overflow-hidden pb-[30px]">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-14 relative">
          
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Encuentra <br />
              Atención Médica <br />
              <span className="text-blue-600">Rápida y Segura</span>
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Con HospitApp, localiza centros médicos y especialistas cerca de ti de manera rápida y sencilla.
            </p>

            {/* Search Input */}
            <div className="mt-6 flex items-center bg-white shadow-md rounded-lg overflow-hidden">
              <span className="px-4 text-gray-500">📍</span>
              <input
                type="text"
                placeholder="Encuentra centros médicos cercanos"
                className="flex-grow py-3 px-2 outline-none"
              />
              <button className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition">
                🔍
              </button>
            </div>
          </div>

          {/* Image*/}
          <div className="md:w-1/2 flex justify-end relative hidden md:block">
            <Image 
              src="/stock/medicos.png" 
              alt="Equipo médico" 
              width={500} 
              height={500} 
              className="max-w-none h-auto absolute bottom-[-250px] right-0"
              priority
            />
          </div>
        </div>
      </section>

      {/* Specialties Section BG #F9FCFF */}
      <section className="bg-[#F9FCFF]">
        <SpecialtiesSection />
      </section>
    </div>
  );
}