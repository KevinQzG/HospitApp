import Image from "next/image";

export default function AboutPage() {
  const TEAM_MEMBERS = [
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
    <section className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] dark:from-[#111827] dark:to-[#1f2937] py-20 px-6 md:px-12">
      {/* Título principal */}
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Quiénes Somos</h1>
        <p className="text-gray-700 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
          HospitApp es una plataforma innovadora diseñada para mejorar el acceso a servicios de salud en Antioquia. Facilitamos la búsqueda de hospitales y clínicas según especialidad, EPS y ubicación, optimizando la experiencia del paciente.
        </p>
      </div>

      {/* Historia */}
      <div className="mt-20 max-w-4xl mx-auto text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Nuestra Historia</h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          HospitApp nació con la misión de solucionar la dificultad de encontrar atención médica de manera eficiente. A través de tecnología avanzada y una interfaz intuitiva, ayudamos a los pacientes a acceder rápidamente a los hospitales adecuados según sus necesidades.
        </p>
      </div>

      {/* Misión y Visión */}
      <div className="mt-20 max-w-4xl mx-auto text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Misión y Visión</h2>
        <div className="space-y-6">
          {[
            {
              title: "Misión",
              text: "Transformar el acceso a la salud mediante una plataforma inteligente, rápida y accesible para todos.",
            },
            {
              title: "Visión",
              text: "Convertirnos en la plataforma de referencia para la búsqueda y navegación de hospitales en toda Colombia y América Latina.",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Valores */}
      <div className="mt-20 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Nuestros Valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Innovación",
              description: "Apostamos por tecnología de vanguardia para mejorar la experiencia del usuario.",
            },
            {
              title: "Accesibilidad",
              description: "Facilitamos el acceso a información médica para todos, sin barreras.",
            },
            {
              title: "Empatía",
              description: "Priorizamos las necesidades de los pacientes para brindar la mejor experiencia.",
            },
          ].map((value, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">{value.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Equipo */}
      <div className="mt-20 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Nuestro Equipo</h2>
        <p className="text-gray-700 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
          Contamos con un equipo multidisciplinario enfocado en crear una plataforma confiable y eficiente.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 dark:border-blue-400">
                <Image
                  src={member.image}
                  alt={`Foto de ${member.name}`}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">{member.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
