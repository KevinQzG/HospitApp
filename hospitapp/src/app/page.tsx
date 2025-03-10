"use server";

import {
  SearchFormClientProps,
  get_search_ips_cached_props,
} from "@/services/search_ips/data_caching.service";
import SearchFormClient from "@/components/search_form_client";
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
          {/* Background Overlay for Depth (Optional) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ECF6FF]/80 to-[#D1E8FF]/60 opacity-50"></div>

          <div className="relative flex flex-col items-center justify-center text-center">
            {/* Text Content */}
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

            {/* Search Form */}
            <div className="w-full mt-8">
              <SearchFormClient
                specialties={config.specialties}
                eps={config.eps}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="bg-[#F9FCFF]">
        <SpecialtiesSection />
      </section>
    </div>
  );
}
