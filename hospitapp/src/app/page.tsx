'use server';

import { SearchFormClientProps, get_search_ips_cached_props } from '@/services/search_ips/data_caching.service';
import SearchFormClient from '@/components/search_form_client';
import SpecialtiesSection from "@/components/SpecialtiesSection";

export default async function HomePage() {
    let config: SearchFormClientProps;

    try {
        config = await get_search_ips_cached_props();
    } catch (error) {
        console.error('Page initialization failed:', error);
        return (
            <div>
                <h2>Configuration Error</h2>
                <p>Failed to load required configuration data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="relative bg-[#ECF6FF] overflow-hidden pb-[30px]">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-14">
                    {/* Text Content */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                            Encuentra <br />
                            Atención Médica <br />
                            <span className="text-blue-600">Rápida y Segura</span>
                        </h1>
                        <p className="mt-4 text-gray-600 text-lg">
                            Con HospitApp, localiza centros médicos y especialistas cerca de ti de manera rápida y sencilla.
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="w-full md:w-1/2 mt-8 md:mt-0">
                        <SearchFormClient specialties={config.specialties} eps={config.eps} />
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