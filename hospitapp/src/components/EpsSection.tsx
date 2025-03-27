"use client";

import { Heart } from "lucide-react";
import EpsCard from "@/components/EpsCard";

interface Eps {
  _id: string;
  name: string;
}

interface EpsSectionProps {
  eps: Eps[];
}

export default function EpsSection({ eps }: EpsSectionProps) {
  const topEps = eps.slice(0, 9);

  const icons = [Heart];

  const formatEpsName = (name: string): string => {
    let formattedName = name.replace(/\bCrus Blanca\b/i, "Cruz Blanca");

    formattedName = formattedName
      .replace(/-(S|C)$/i, "")
      .trim();

    return formattedName.toUpperCase();
  };

  return (
    <section className="py-12 sm:py-16 text-center px-4 sm:px-6 lg:px-8 bg-[#F9FCFF] dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          EPS más buscadas
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
          ¿No encuentras tu EPS?{" "}
          <a
            href="#search-form"
            className="text-blue-800 dark:text-blue-400 underline hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
            style={{ scrollBehavior: "smooth" }}
          >
            Usa el formulario de búsqueda arriba.
          </a>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {topEps.map((epsItem, index) => (
            <EpsCard
              key={epsItem._id}
              name={epsItem.name}
              displayName={formatEpsName(epsItem.name)}
              icon={icons[index % icons.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}