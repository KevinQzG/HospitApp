import Image from "next/image";

export default function about_page() {
  const _TEAM_MEMBERS = [
    {
      name: "Luis Carlos Castro",
      role: "Product Owner",
      image: "/team/founder1.png",
    },
    {
      name: "Kevin Quiroz",
      role: "Programador / UX-UI Designer",
      image: "/team/founder2.jpg",
    },
    {
      name: "Juan Felipe Restrepo",
      role: "Scrum Master / Tester",
      image: "/team/founder3.jpg",
    },
    {
      name: "Julián Mejía",
      role: "Arquitecto / Programador",
      image: "/team/founder4.png",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Quiénes Somos</h1>
        <p className="text-gray-700 text-xl max-w-3xl mx-auto">
          HospitApp es una plataforma innovadora diseñada para mejorar el acceso a servicios de salud en Antioquia. Facilitamos la búsqueda de hospitales y clínicas según especialidad, EPS y ubicación, optimizando la experiencia del paciente.
        </p>
      </div>

      {/* History */}
      <div className="mt-20 max-w-4xl mx-auto text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          HospitApp nació con la misión de solucionar la dificultad de encontrar atención médica de manera eficiente. A través de tecnología avanzada y una interfaz intuitiva, ayudamos a los pacientes a acceder rápidamente a los hospitales adecuados según sus necesidades.
        </p>
      </div>

      {/* Mision and Vision */}
      <div className="mt-20 max-w-4xl mx-auto text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Misión y Visión</h2>
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Misión</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Transformar el acceso a la salud mediante una plataforma inteligente, rápida y accesible para todos.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Visión</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Convertirnos en la plataforma de referencia para la búsqueda y navegación de hospitales en toda Colombia y América Latina.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mt-20 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Nuestros Valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Innovación</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Apostamos por tecnología de vanguardia para mejorar la experiencia del usuario.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Accesibilidad</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Facilitamos el acceso a información médica para todos, sin barreras.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Empatía</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Priorizamos las necesidades de los pacientes para brindar la mejor experiencia.
            </p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mt-20 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Nuestro Equipo</h2>
        <p className="text-gray-700 text-xl max-w-3xl mx-auto">
          Contamos con un equipo multidisciplinario enfocado en crear una plataforma confiable y eficiente.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {_TEAM_MEMBERS.map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-6">
                {member.name}
              </h3>
              <p className="text-gray-600 text-lg mt-2">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}