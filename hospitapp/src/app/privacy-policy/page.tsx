export default function privacy_policy_page() {
  const _CONTACT_INFO = {
    email: "admin@hospitapp.com",
    location: "Medellín, Antioquia, Colombia",
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Política de Privacidad</h1>
        <p className="text-gray-700 text-xl max-w-3xl mx-auto leading-relaxed">
          En HospitAPP, tu privacidad y seguridad son nuestra máxima prioridad. Esta política detalla cómo recopilamos, utilizamos y protegemos tu información personal, garantizando transparencia y cumplimiento con las normativas vigentes.
        </p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto space-y-12 text-gray-800 leading-relaxed">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">1. Introducción</h2>
          <p className="text-gray-700 text-lg">
            Esta política de privacidad describe cómo HospitAPP recopila, utiliza y protege la información personal de nuestros usuarios. Nos regimos por la <strong>Ley 1581 de 2012</strong> de Colombia y el <strong>Reglamento General de Protección de Datos (GDPR)</strong> de la Unión Europea, asegurando el manejo responsable de tus datos.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">2. Datos que Recopilamos</h2>
          <p className="text-gray-700 text-lg mb-4">
            Recopilamos únicamente la información necesaria para brindarte nuestros servicios. Los datos que solicitamos incluyen:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700 text-lg">
            <li><strong>Información de contacto:</strong> Nombre, correo electrónico y número de teléfono.</li>
            <li><strong>Ubicación:</strong> Para mejorar la precisión en la búsqueda de hospitales y clínicas cercanas.</li>
            <li><strong>Preferencias médicas:</strong> EPS y especialidades médicas para filtrar resultados personalizados.</li>
            <li><strong>Reseñas y comentarios:</strong> Opiniones sobre hospitales y servicios de salud.</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">3. Uso de la Información</h2>
          <p className="text-gray-700 text-lg mb-4">
            Utilizamos tus datos exclusivamente para mejorar tu experiencia en HospitAPP. Los principales usos incluyen:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700 text-lg">
            <li>Facilitar la búsqueda y navegación en hospitales y clínicas.</li>
            <li>Personalizar resultados según tu EPS y especialidades médicas.</li>
            <li>Garantizar la seguridad de la plataforma y prevenir actividades fraudulentas.</li>
            <li>Analizar datos para mejorar la usabilidad y funcionalidad del sistema.</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">4. Protección y Seguridad</h2>
          <p className="text-gray-700 text-lg mb-4">
            Implementamos medidas de seguridad avanzadas para proteger tu información. Entre ellas:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700 text-lg">
            <li><strong>Cifrado de datos:</strong> Utilizamos TLS para proteger la transmisión de información.</li>
            <li><strong>Almacenamiento seguro:</strong> Tus datos se guardan en servidores con altos estándares de seguridad.</li>
            <li><strong>Acceso restringido:</strong> Solo personal autorizado puede acceder a información confidencial.</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">5. Derechos del Usuario</h2>
          <p className="text-gray-700 text-lg mb-4">
            De acuerdo con la legislación colombiana y el GDPR, tienes los siguientes derechos:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700 text-lg">
            <li>Acceder, actualizar o corregir tus datos personales.</li>
            <li>Solicitar la eliminación de tus datos en cualquier momento.</li>
            <li>Retirar el consentimiento para el uso de tu información.</li>
            <li>Recibir información clara sobre cómo se manejan tus datos.</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">6. Cookies y Tecnologías de Seguimiento</h2>
          <p className="text-gray-700 text-lg">
            HospitAPP utiliza cookies para mejorar tu experiencia. Puedes gestionar tus preferencias en la configuración de tu navegador. Para más detalles, consulta nuestra <a href="/politica-de-cookies" className="text-blue-600 hover:underline">Política de Cookies</a>.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">7. Compartición de Datos</h2>
          <p className="text-gray-700 text-lg">
            No vendemos ni compartimos tus datos personales con terceros, excepto cuando sea necesario para el funcionamiento de la plataforma o requerido por ley.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">8. Cambios en la Política</h2>
          <p className="text-gray-700 text-lg">
            Nos reservamos el derecho de actualizar esta política. Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">9. Contacto</h2>
          <p className="text-gray-700 text-lg mb-4">
            Si tienes preguntas o inquietudes sobre nuestra política de privacidad, no dudes en contactarnos:
          </p>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              📧{" "}
              <a
                href={`mailto:${_CONTACT_INFO.email}`}
                className="text-blue-600 hover:underline"
              >
                {_CONTACT_INFO.email}
              </a>
            </p>
            <p className="text-lg font-semibold text-gray-900">
              📍 {_CONTACT_INFO.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}