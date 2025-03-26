export default function TermsOfServicePage() {
  const CONTACT_INFO = {
    email: "admin@hospitapp.com",
    location: "Medellín, Antioquia, Colombia",
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] dark:from-[#111827] dark:to-[#1f2937] py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Términos y Condiciones
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
          Bienvenido a HospitAPP. Al utilizar nuestra plataforma, aceptas los
          siguientes términos y condiciones, que regulan tu acceso y uso de
          nuestros servicios.
        </p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto space-y-12 text-gray-800 dark:text-gray-200 leading-relaxed">
        {[
          {
            title: "1. Introducción",
            content: `Estos términos y condiciones rigen el uso de HospitAPP. Al acceder o utilizar nuestra plataforma, aceptas cumplir con estas disposiciones. Si no estás de acuerdo, te recomendamos no utilizar nuestros servicios.`,
          },
          {
            title: "2. Uso de la Plataforma",
            content: `HospitAPP proporciona información sobre hospitales y servicios médicos en Colombia. Al utilizar la plataforma, te comprometes a:`,
            list: [
              "Utilizar la plataforma de manera ética y conforme a la ley.",
              "No manipular información con fines fraudulentos o maliciosos.",
              "No realizar intentos de acceso no autorizado o ataques de seguridad.",
            ],
          },
          {
            title: "3. Registro y Cuenta",
            content: `Para acceder a funcionalidades avanzadas, es necesario registrarse. Al crear una cuenta, aceptas:`,
            list: [
              "Proporcionar información veraz, precisa y actualizada.",
              "Responsabilizarte por la seguridad de tu cuenta y contraseña.",
              "No compartir tus credenciales con terceros.",
            ],
          },
          {
            title: "4. Responsabilidad del Usuario",
            content:
              "El usuario es responsable de todas las actividades realizadas bajo su cuenta. HospitAPP no se hace responsable por el uso indebido de la plataforma.",
          },
          {
            title: "5. Limitación de Responsabilidad",
            content: `Aunque nos esforzamos por mantener la información actualizada, no garantizamos que esté libre de errores. HospitAPP no se responsabiliza por:`,
            list: [
              "Información desactualizada proporcionada por terceros.",
              "Problemas técnicos fuera de nuestro control.",
              "Decisiones médicas basadas en la información publicada.",
            ],
          },
          {
            title: "6. Política de Privacidad",
            content: (
              <>
                La protección de tus datos es fundamental. Consulta nuestra{" "}
                <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Política de Privacidad
                </a>{" "}
                para conocer cómo manejamos tu información, en cumplimiento de la{" "}
                <strong>Ley 1581 de 2012</strong> y el <strong>GDPR</strong>.
              </>
            ),
          },
          {
            title: "7. Modificaciones a los Términos",
            content:
              "Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico.",
          },
          {
            title: "8. Propiedad Intelectual",
            content:
              "Todo el contenido de HospitAPP, incluyendo textos, logotipos, diseños y funcionalidades, está protegido por derechos de autor y no puede ser reproducido sin autorización expresa.",
          },
          {
            title: "9. Terminación del Servicio",
            content:
              "HospitAPP puede suspender o eliminar cuentas que violen estos términos sin previo aviso. Nos reservamos el derecho de denegar el acceso a cualquier usuario.",
          },
          {
            title: "10. Legislación Aplicable",
            content:
              "Estos términos se rigen por la legislación colombiana. Cualquier disputa será resuelta bajo la jurisdicción de los tribunales de Medellín, Antioquia.",
          },
        ].map((section, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {section.title}
            </h2>
            {typeof section.content === "string" ? (
              <p className="text-lg mb-4">{section.content}</p>
            ) : (
              <p className="text-lg mb-4">{section.content}</p>
            )}
            {section.list && (
              <ul className="list-disc pl-8 space-y-3 text-lg">
                {section.list.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            11. Contacto
          </h2>
          <p className="text-lg mb-4">
            Si tienes preguntas o inquietudes sobre estos términos, no dudes en contactarnos:
          </p>
          <div className="space-y-2">
            <p className="text-lg font-semibold">
              📧{" "}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {CONTACT_INFO.email}
              </a>
            </p>
            <p className="text-lg font-semibold">📍 {CONTACT_INFO.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
