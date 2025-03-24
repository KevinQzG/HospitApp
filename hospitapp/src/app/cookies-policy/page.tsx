export default function CookiesPolicyPage() {
  const CONTACT_INFO = {
    email: "admin@hospitapp.com",
    location: "Medellín, Antioquia, Colombia",
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] dark:from-[#111827] dark:to-[#1f2937] py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Política de Cookies
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
          En HospitApp, utilizamos cookies para mejorar tu experiencia de
          usuario, personalizar los resultados de búsqueda y garantizar el
          funcionamiento óptimo de nuestra plataforma. A continuación, te
          explicamos de manera detallada cómo y por qué utilizamos estas
          tecnologías.
        </p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto space-y-12 text-gray-800 dark:text-gray-200 leading-relaxed">
        {[
          {
            title: "1. ¿Qué son las Cookies?",
            content:
              "Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Estas herramientas nos permiten recordar tus preferencias, mejorar la navegación y ofrecerte una experiencia personalizada. Es importante destacar que las cookies no contienen información sensible, como contraseñas o datos financieros.",
          },
          {
            title: "2. Uso de Cookies en HospitApp",
            content:
              "En HospitApp, utilizamos cookies exclusivamente para optimizar tu experiencia en la plataforma. Algunos de los usos principales incluyen:",
            list: [
              "Personalizar los resultados de búsqueda según tu ubicación geográfica.",
              "Mejorar la precisión de los filtros de especialidades médicas y EPS.",
              "Evitar la intrusión de anuncios de terceros en tu experiencia de usuario.",
              "Mostrar únicamente promociones de hospitales que han optado por posicionarse en los primeros resultados de búsqueda.",
            ],
          },
          {
            title: "3. Tipos de Cookies que Usamos",
            content:
              "En HospitApp, empleamos diferentes tipos de cookies para garantizar un servicio de calidad:",
            list: [
              "**Cookies Esenciales:** Indispensables para el correcto funcionamiento del sitio.",
              "**Cookies de Personalización:** Adaptan la plataforma a tus preferencias y ubicación.",
              "**Cookies Analíticas:** Nos permiten analizar el comportamiento de los usuarios para mejorar continuamente nuestros servicios.",
            ],
          },
          {
            title: "4. ¿Se Comparten las Cookies con Terceros?",
            content:
              "No. HospitApp no comparte, vende ni transfiere los datos recopilados mediante cookies a terceros. Toda la información se utiliza exclusivamente para mejorar tu experiencia en nuestra plataforma.",
          },
          {
            title: "5. Control y Configuración de Cookies",
            content:
              "Tienes el control total sobre las cookies. Puedes gestionar o desactivar su uso a través de la configuración de tu navegador. Sin embargo, ten en cuenta que deshabilitar ciertas cookies podría afectar la funcionalidad de HospitApp.",
            list: [
              "**Google Chrome:** Configuración > Privacidad y seguridad > Cookies y otros datos de sitios.",
              "**Mozilla Firefox:** Opciones > Privacidad > Cookies y datos del sitio.",
              "**Safari:** Preferencias > Privacidad > Gestionar cookies.",
              "**Microsoft Edge:** Configuración > Privacidad y servicios > Cookies.",
            ],
          },
          {
            title: "6. Legislación Aplicable",
            content: (
              <>
                Nuestra política de cookies cumple con las normativas
                colombianas, en particular con la{" "}
                <strong>Ley 1581 de 2012</strong>, y se alinea con los
                estándares internacionales, como el{" "}
                <strong>Reglamento General de Protección de Datos (GDPR)</strong>{" "}
                de la Unión Europea.
              </>
            ),
          },
        ].map((section, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
          >
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {section.title}
            </h2>
            <p className="text-lg mb-4">
              {typeof section.content === "string" ? (
                section.content
              ) : (
                section.content
              )}
            </p>
            {section.list && (
              <ul className="list-disc pl-6 mt-2 space-y-2">
                {section.list.map((item, index) => (
                  <li
                    key={index}
                    className="text-gray-700 dark:text-gray-300 text-lg"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            7. Contacto
          </h2>
          <p className="text-lg mb-4">
            Si tienes preguntas o necesitas más información sobre nuestra
            política de cookies, no dudes en contactarnos:
          </p>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              📧{" "}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {CONTACT_INFO.email}
              </a>
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              📍 {CONTACT_INFO.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
