import { Suspense } from "react";
import {
  SearchFormClientProps,
  get_search_ips_cached_props as getSearchIpsCachedProps,
} from "@/services/search_ips/data_caching.service";
import LandingSearchForm from "@/components/LandingSearchForm";
import SpecialtiesSection from "@/components/SpecialtiesSection";

export default async function HomePage() {
  let config: SearchFormClientProps;

  try {
    config = await getSearchIpsCachedProps();
  } catch (error) {
    console.error("Page initialization failed:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-gray-800 dark:text-gray-200 px-6">
        <h2 className="text-2xl font-semibold">Configuration Error</h2>
        <p className="mt-4 max-w-md text-center">
          Failed to load required configuration data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-[#ECF6FF] dark:bg-[#0f172a] overflow-hidden pb-[30px] transition-colors duration-300">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-14 md:py-20">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ECF6FF]/80 to-[#D1E8FF]/60 dark:from-blue-950/60 dark:to-sky-900/40 opacity-50"></div>

          <div className="relative flex flex-col items-center justify-center text-center">
            <div className="w-full text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                Encuentra <br className="hidden md:block" />
                Atención Médica <br />
                <span className="text-blue-800 dark:text-blue-400">Rápida y Segura</span>
              </h1>
              <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-prose mx-auto">
                Con HospitApp, localiza centros médicos y especialistas cerca de ti de manera rápida y sencilla.
              </p>
            </div>

            <div className="w-full mt-8">
              <Suspense fallback={<div className="text-gray-600 dark:text-gray-300">Cargando formulario de búsqueda...</div>}>
                <LandingSearchForm specialties={config.specialties} eps={config.eps} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="bg-[#F9FCFF] dark:bg-gray-900 transition-colors duration-300">
        <SpecialtiesSection />
      </section>
    </div>
  );
}
