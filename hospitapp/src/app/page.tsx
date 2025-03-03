import Image from "next/image";
import SpecialtiesSection from "@/components/SpecialtiesSection";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#ECF6FF] overflow-hidden pb-24">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-16 relative">
          
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left z-20">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Encuentra <br />
              Atención Médica <br />
              <span className="text-blue-600">Rápida y Segura</span>
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Con HospitAPP, localiza centros médicos y especialistas cerca de ti de manera rápida y sencilla.
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

          {/* Image */}
          <div className="md:w-1/2 flex justify-center md:justify-end relative">
            <Image 
              src="/medicos.png" 
              alt="Equipo médico" 
              width={500} 
              height={550} 
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto absolute bottom-[-100px] sm:bottom-[-150px] md:bottom-[-200px] right-0 object-cover"
              priority
            />
          </div>

        </div>
      </section>

      <div className="w-full h-20 bg-gradient-to-b from-[#ECF6FF] to-[#F9FCFF]"></div>

      {/* Specialties Section */}
      <SpecialtiesSection />
    </div>
  );
}
