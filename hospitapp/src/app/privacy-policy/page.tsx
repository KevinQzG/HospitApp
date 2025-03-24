export default function PrivacyPolicyPage() {
  const CONTACT_INFO = {
    email: "admin@hospitapp.com",
    location: "Medellín, Antioquia, Colombia",
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] dark:from-gray-900 dark:to-gray-800 py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Política de Privacidad
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
          En HospitAPP, tu privacidad y seguridad son nuestra máxima prioridad.
          Esta política detalla cómo recopilamos, utilizamos y protegemos tu
          información personal, garantizando transparencia y cumplimiento con
          las normativas vigentes.
        </p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto space-y-12 text-gray-800 dark:text-gray-200 leading-relaxed">
        {/* Secciones */}
        {[
          {
            title: "1. Introducción",
            content: (
              <>
                Esta política de privacidad describe cómo HospitAPP recopila,
                utiliza y protege la información personal de nuestros usuarios.
                Nos regimos por la <strong>Ley 1581 de 2012</strong> de
                Colombia y el{" "}
                <strong>Reglamento General de Protección de Datos (GDPR)</strong>{" "}
                de la Unión Europea, asegurando el manejo responsable de tus
                datos.
              </>
            ),
          },
          {
            title: "2. Datos que Recopilamos",
            content: (
              <>
                Recopilamos únicamente la información necesaria para brindarte
                nuestros servicios. Los datos que solicitamos incluyen:
                <ul className="list-disc pl-8 space-y-3 mt-4">
                  <li>
                    <strong>Información de contacto:</strong> Nombre, correo
                    electrónico y número de teléfono.
                  </li>
                  <li>
                    <strong>Ubicación:</strong> Para mejorar la precisión en la
                    búsqueda de hospitales y clínicas cercanas.
                  </li>
                  <li>
                    <strong>Preferencias médicas:</strong> EPS y especialidades
                    médicas para filtrar resultados personalizados.
                  </li>
                  <li>
                    <strong>Reseñas y comentarios:</strong> Opiniones sobre
                    hospitales y servicios de salud.
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: "3. Uso de la Información",
            content: (
              <>
                Utilizamos tus datos exclusivamente para mejorar tu experiencia
                en HospitAPP. Los principales usos incluyen:
                <ul className="list-disc pl-8 space-y-3 mt-4">
                  <li>
                    Facilitar la búsqueda y navegación en hospitales y clínicas.
                  </li>
                  <li>
                    Personalizar resultados según tu EPS y especialidades
                    médicas.
                  </li>
                  <li>
                    Garantizar la seguridad de la plataforma y prevenir
                    actividades fraudulentas.
                  </li>
                  <li>
                    Analizar datos para mejorar la usabilidad y funcionalidad
                    del sistema.
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: "4. Protección y Seguridad",
            content: (
              <>
                Implementamos medidas de seguridad avanzadas para proteger tu
                información. Entre ellas:
                <ul className="list-disc pl-8 space-y-3 mt-4">
                  <li>
                    <strong>Cifrado de datos:</strong> Utilizamos TLS para
                    proteger la transmisión de información.
                  </li>
                  <li>
                    <strong>Almacenamiento seguro:</strong> Tus datos se guardan
                    en servidores con altos estándares de seguridad.
                  </li>
                  <li>
                    <strong>Acceso restringido:</strong> Solo personal
                    autorizado puede acceder a información confidencial.
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: "5. Derechos del Usuario",
            content: (
              <>
                De acuerdo con la legislación colombiana y el GDPR, tienes los
                siguientes derechos:
                <ul className="list-disc pl-8 space-y-3 mt-4">
                  <li>Acceder, actualizar o corregir tus datos personales.</li>
                  <li>Solicitar la eliminación de tus datos en cualquier momento.</li>
                  <li>Retirar el consentimiento para el uso de tu información.</li>
                  <li>Recibir información clara sobre cómo se manejan tus datos.</li>
                </ul>
              </>
            ),
          },
          {
            title: "6. Cookies y Tecnologías de Seguimiento",
            content: (
              <>
                HospitAPP utiliza cookies para mejorar tu experiencia. Puedes
                gestionar tus preferencias en la configuración de tu navegador.
                Para más detalles, consulta nuestra{" "}
                <a
                  href="/politica-de-cookies"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Política de Cookies
                </a>
                .
              </>
            ),
          },
          {
            title: "7. Compartición de Datos",
            content: (
              <>
                No vendemos ni compartimos tus datos personales con terceros,
                excepto cuando sea necesario para el funcionamiento de la
                plataforma o requerido por ley.
              </>
            ),
          },
          {
            title: "8. Cambios en la Política",
            content: (
              <>
                Nos reservamos el derecho de actualizar esta política. Te
                notificaremos sobre cambios significativos a través de la
                plataforma o por correo electrónico.
              </>
            ),
          },
          {
            title: "9. Contacto",
            content: (
              <>
                Si tienes preguntas o inquietudes sobre nuestra política de
                privacidad, no dudes en contactarnos:
                <div className="mt-4 space-y-2">
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
              </>
            ),
          },
        ].map((section, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {section.title}
            </h2>
            <div className="text-gray-700 dark:text-gray-300 text-lg">{section.content}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
