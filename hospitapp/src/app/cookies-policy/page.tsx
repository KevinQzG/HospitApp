export default function CookiesPolicyPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Política de Cookies
        </h1>
        <p className="text-gray-700 text-xl max-w-3xl mx-auto leading-relaxed">
          En HospitApp, utilizamos cookies para mejorar tu experiencia de
          usuario, personalizar los resultados de búsqueda y garantizar el
          funcionamiento óptimo de nuestra plataforma. A continuación, te
          explicamos de manera detallada cómo y por qué utilizamos estas
          tecnologías.
        </p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto space-y-12 text-gray-800 leading-relaxed">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            1. ¿Qué son las Cookies?
          </h2>
          <p className="text-gray-700 text-lg">
            Las cookies son pequeños archivos de texto que se almacenan en tu
            dispositivo cuando visitas un sitio web. Estas herramientas nos
            permiten recordar tus preferencias, mejorar la navegación y
            ofrecerte una experiencia personalizada. Es importante destacar que
            las cookies no contienen información sensible, como contraseñas o
            datos financieros.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            2. Uso de Cookies en HospitApp
          </h2>
          <p className="text-gray-700 text-lg mb-4">
            En HospitApp, utilizamos cookies exclusivamente para optimizar tu
            experiencia en la plataforma. Algunos de los usos principales
            incluyen:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700 text-lg">
            <li>
              Personalizar los resultados de búsqueda según tu ubicación
              geográfica.
            </li>
            <li>
              Mejorar la precisión de los filtros de especialidades médicas y
              EPS.
            </li>
            <li>
              Evitar la intrusión de anuncios de terceros en tu experiencia de
              usuario.
            </li>
            <li>
              Mostrar únicamente promociones de hospitales que han optado por
              posicionarse en los primeros resultados de búsqueda.
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            3. Tipos de Cookies que Usamos
          </h2>
          <p className="text-gray-700 text-lg mb-4">
            En HospitApp, empleamos diferentes tipos de cookies para garantizar
            un servicio de calidad:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700 text-lg">
            <li>
              <strong>Cookies Esenciales:</strong> Indispensables para el
              correcto funcionamiento del sitio.
            </li>
            <li>
              <strong>Cookies de Personalización:</strong> Adaptan la plataforma
              a tus preferencias y ubicación.
            </li>
            <li>
              <strong>Cookies Analíticas:</strong> Nos permiten analizar el
              comportamiento de los usuarios para mejorar continuamente nuestros
              servicios.
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            4. ¿Se Comparten las Cookies con Terceros?
          </h2>
          <p className="text-gray-700 text-lg">
            No. HospitApp no comparte, vende ni transfiere los datos recopilados
            mediante cookies a terceros. Toda la información se utiliza
            exclusivamente para mejorar tu experiencia en nuestra plataforma.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            5. Control y Configuración de Cookies
          </h2>
          <p className="text-gray-700 text-lg">
            Tienes el control total sobre las cookies. Puedes gestionar o
            desactivar su uso a través de la configuración de tu navegador. Sin
            embargo, ten en cuenta que deshabilitar ciertas cookies podría
            afectar la funcionalidad de HospitApp.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>Google Chrome:</strong> Configuración &gt; Privacidad y
              seguridad &gt; Cookies y otros datos de sitios.
            </li>
            <li>
              <strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad &gt;
              Cookies y datos del sitio.
            </li>
            <li>
              <strong>Safari:</strong> Preferencias &gt; Privacidad &gt;
              Gestionar cookies.
            </li>
            <li>
              <strong>Microsoft Edge:</strong> Configuración &gt; Privacidad y
              servicios &gt; Cookies.
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            6. Legislación Aplicable
          </h2>
          <p className="text-gray-700 text-lg">
            Nuestra política de cookies cumple con las normativas colombianas,
            en particular con la <strong>Ley 1581 de 2012</strong>, y se alinea
            con los estándares internacionales, como el{" "}
            <strong>Reglamento General de Protección de Datos (GDPR)</strong> de
            la Unión Europea.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">7. Contacto</h2>
          <p className="text-gray-700 text-lg mb-4">
            Si tienes preguntas o necesitas más información sobre nuestra
            política de cookies, no dudes en contactarnos:
          </p>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              📧{" "}
              <a
                href="mailto:admin@hospitapp.com"
                className="text-blue-600 hover:underline"
              >
                admin@hospitapp.com
              </a>
            </p>
            <p className="text-lg font-semibold text-gray-900">
              📍 Medellín, Antioquia, Colombia
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
