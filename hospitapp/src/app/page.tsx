// app/page.tsx
import { Suspense } from "react";
import {
  SearchFormClientProps,
  get_search_ips_cached_props,
} from "@/services/search_ips/data_caching.service";
import LandingSearchForm from "@/components/LandingSearchForm";
import SpecialtiesSection from "@/components/SpecialtiesSection";

export default async function HomePage() {
  let config: SearchFormClientProps;

  try {
    config = await get_search_ips_cached_props();
  } catch (error) {
    console.error("Page initialization failed:", error);
    return (
      <div>
        <h2>Configuration Error</h2>
        <p>
          Failed to load required configuration data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#ECF6FF] overflow-hidden pb-[30px]">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-14 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ECF6FF]/80 to-[#D1E8FF]/60 opacity-50"></div>

          <div className="relative flex flex-col items-center justify-center text-center">
            <div className="w-full text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Encuentra <br className="hidden md:block" />
                Atención Médica <br />
                <span className="text-blue-600">Rápida y Segura</span>
              </h1>
              <p className="mt-6 text-gray-600 text-lg md:text-xl max-w-prose mx-auto">
                Con HospitApp, localiza centros médicos y especialistas cerca de
                ti de manera rápida y sencilla.
              </p>
            </div>

            <div className="w-full mt-8">
              <Suspense fallback={<div>Cargando formulario de búsqueda...</div>}>
                <LandingSearchForm specialties={config.specialties} eps={config.eps} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F9FCFF]">
        <SpecialtiesSection />
      </section>
    </div>
  );
}