export default function terms_of_service_page() {
  const _CONTACT_INFO = {
    email: "admin@hospitapp.com",
    location: "Medellín, Antioquia, Colombia",
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Términos y Condiciones
        </h1>
        <p className="text-gray-700 text-xl max-w-3xl mx-auto leading-relaxed">
          Bienvenido a HospitAPP. Al utilizar nuestra plataforma, aceptas los
          siguientes términos y condiciones, que regulan tu acceso y uso de
          nuestros servicios.
        </p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto space-y-12 text-gray-800 leading-relaxed">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            1. Introducción
          </h2>
          <p className="text-gray-700 text-lg">
            Estos términos y condiciones rigen el uso de HospitAPP. Al acceder o
            utilizar nuestra plataforma, aceptas cumplir con estas
            disposiciones. Si no estás de acuerdo, te recomendamos no utilizar
            nuestros servicios.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            2. Uso de la Plataforma
          </h2>
          <p className="text-gray-700 text-lg mb-4">
            HospitAPP proporciona información sobre hospitales y servicios
            médicos en Colombia. Al utilizar la plataforma, te comprometes a:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700 text-lg">
            <li>Utilizar la plataforma de manera ética y conforme a la ley.</li>
            <li>
              No manipular información con fines fraudulentos o maliciosos.
            </li>
            <li>
              No realizar intentos de acceso no autorizado o ataques de
              seguridad.
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            3. Registro y Cuenta
          </h2>
          <p className="text-gray-700 text-lg mb-4">
            Para acceder a funcionalidades avanzadas, es necesario registrarse.
            Al crear una cuenta, aceptas:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700 text-lg">
            <li>Proporcionar información veraz, precisa y actualizada.</li>
            <li>
              Responsabilizarte por la seguridad de tu cuenta y contraseña.
            </li>
            <li>No compartir tus credenciales con terceros.</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            4. Responsabilidad del Usuario
          </h2>
          <p className="text-gray-700 text-lg">
            El usuario es responsable de todas las actividades realizadas bajo
            su cuenta. HospitAPP no se hace responsable por el uso indebido de
            la plataforma.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            5. Limitación de Responsabilidad
          </h2>
          <p className="text-gray-700 text-lg mb-4">
            Aunque nos esforzamos por mantener la información actualizada, no
            garantizamos que esté libre de errores. HospitAPP no se
            responsabiliza por:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-gray-700 text-lg">
            <li>Información desactualizada proporcionada por terceros.</li>
            <li>Problemas técnicos fuera de nuestro control.</li>
            <li>Decisiones médicas basadas en la información publicada.</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            6. Política de Privacidad
          </h2>
          <p className="text-gray-700 text-lg">
            La protección de tus datos es fundamental. Consulta nuestra{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Política de Privacidad
            </a>{" "}
            para conocer cómo manejamos tu información, en cumplimiento de la{" "}
            <strong>Ley 1581 de 2012</strong> y el <strong>GDPR</strong>.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            7. Modificaciones a los Términos
          </h2>
          <p className="text-gray-700 text-lg">
            Nos reservamos el derecho de modificar estos términos en cualquier
            momento. Te notificaremos sobre cambios significativos a través de
            la plataforma o por correo electrónico.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            8. Propiedad Intelectual
          </h2>
          <p className="text-gray-700 text-lg">
            Todo el contenido de HospitAPP, incluyendo textos, logotipos,
            diseños y funcionalidades, está protegido por derechos de autor y no
            puede ser reproducido sin autorización expresa.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            9. Terminación del Servicio
          </h2>
          <p className="text-gray-700 text-lg">
            HospitAPP puede suspender o eliminar cuentas que violen estos
            términos sin previo aviso. Nos reservamos el derecho de denegar el
            acceso a cualquier usuario.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            10. Legislación Aplicable
          </h2>
          <p className="text-gray-700 text-lg">
            Estos términos se rigen por la legislación colombiana. Cualquier
            disputa será resuelta bajo la jurisdicción de los tribunales de
            Medellín, Antioquia.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            11. Contacto
          </h2>
          <p className="text-gray-700 text-lg mb-4">
            Si tienes preguntas o inquietudes sobre estos términos, no dudes en
            contactarnos:
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