import SpecialtyCard from "@/components/SpecialtyCard";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-blue-700">
            Encuentra Atención Médica <br />
            <span className="text-gray-900">Rápida y Segura</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Con HospitApp, localiza centros médicos y especialistas cerca de ti
            de manera rápida y sencilla.
          </p>
          <div className="mt-6 flex justify-center">
            <input
              type="text"
              placeholder="Encuentra centros médicos cercanos"
              className="w-80 px-4 py-3 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition">
              🔍
            </button>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className="py-16 text-center bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-800">Algunas especialidades</h3>
          <p className="text-gray-500">Encuentra atención especializada en diferentes áreas de la salud.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-8">
            <SpecialtyCard name="Odontología" />
            <SpecialtyCard name="Diagnóstico General" active />
            <SpecialtyCard name="Neurología" />
            <SpecialtyCard name="Cardiología" />
            <SpecialtyCard name="Nutrición" />
            <SpecialtyCard name="Ortopedia" />
            <SpecialtyCard name="Endocrinología" />
            <SpecialtyCard name="Psicología" />
            <SpecialtyCard name="+ Especialidades" />
          </div>
        </div>
      </section>
    </div>
  );
}
