export default function FaqsPage() {
  const FAQS = [
    {
      question: "¿Cómo funciona HospitAPP?",
      answer:
        "HospitAPP te permite encontrar centros médicos cercanos de forma rápida y sencilla. Filtra por especialidad, EPS y calificaciones para obtener resultados personalizados.",
    },
    {
      question: "¿Es necesario registrarse?",
      answer:
        "No es obligatorio, pero al registrarte puedes acceder a funcionalidades avanzadas como guardar tus hospitales favoritos, dejar reseñas y recibir recomendaciones personalizadas.",
    },
    {
      question: "¿HospitAPP es gratuito?",
      answer:
        "Sí, nuestra plataforma es completamente gratuita para los usuarios que buscan atención médica. No cobramos por el uso básico de la aplicación.",
    },
    {
      question: "¿Cómo se eligen los hospitales recomendados?",
      answer:
        "Los hospitales y clínicas recomendados se basan en reseñas de usuarios, disponibilidad de servicios, proximidad a tu ubicación y calificaciones de calidad.",
    },
    {
      question: "¿HospitAPP tiene integración con Google Maps y Waze?",
      answer:
        "Sí, puedes obtener direcciones precisas a los hospitales mediante la integración con Google Maps y Waze, facilitando tu desplazamiento.",
    },
    {
      question: "¿Cómo puedo dejar una reseña sobre un hospital?",
      answer:
        "Solo necesitas registrarte en HospitAPP y podrás calificar y comentar sobre los servicios médicos que hayas recibido. ¡Tu opinión es muy valiosa para nosotros!",
    },
    {
      question: "¿Qué especialidades médicas están disponibles en HospitAPP?",
      answer:
        "Actualmente contamos con 138 especialidades, incluyendo cardiología, neurología, odontología, pediatría, ginecología y muchas más. Estamos en constante expansión para cubrir todas tus necesidades médicas.",
    },
    {
      question: "¿Cómo puedo contactar con atención al cliente de HospitAPP?",
      answer:
        "Puedes escribirnos al correo electrónico <a href='mailto:admin@hospitapp.com' class='text-blue-600 hover:underline'>admin@hospitapp.com</a> y te responderemos a la brevedad.",
    },
    {
      question: "¿Qué hago si encuentro información incorrecta en la plataforma?",
      answer:
        "Si notas datos erróneos, por favor repórtalos mediante el formulario de contacto o escríbenos a nuestro correo. Tu retroalimentación nos ayuda a mejorar.",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h1>
        <p className="text-gray-700 text-xl">
          Encuentra respuestas a las dudas más comunes sobre HospitAPP. Si no encuentras lo que buscas, no dudes en contactarnos.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto mt-16 space-y-6">
        {FAQS.map((faq, index) => (
          <details
            key={index}
            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
          >
            <summary className="flex justify-between items-center text-xl font-semibold text-gray-900">
              {faq.question}
              <span className="text-blue-600 transform transition-transform duration-300 group-open:rotate-90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </summary>
            <p
              className="mt-4 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            ></p>
          </details>
        ))}
      </div>
    </section>
  );
}