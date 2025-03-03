import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faXTwitter,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Branding */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-semibold">HospitAPP</h2>
          <p className="text-sm mt-2 max-w-xs leading-relaxed">
            La forma más rápida, segura e inteligente de encontrar atención médica en Colombia.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faFacebookF} size="lg" />
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faXTwitter} size="lg" />
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faTiktok} size="lg" />
            </a>
          </div>
        </div>

        {/* Navegate */}
        <div>
          <h3 className="text-lg font-semibold">Explorar</h3>
          <ul className="text-sm space-y-2 mt-3">
            <li><a href="/" className="hover:underline">Inicio</a></li>
            <li><a href="/specialties" className="hover:underline">Especialidades</a></li>
            <li><a href="/login" className="hover:underline">Iniciar sesión</a></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="text-lg font-semibold">Sobre Nosotros</h3>
          <ul className="text-sm space-y-2 mt-3">
            <li><a href="/about" className="hover:underline">Quiénes somos</a></li>
            <li><a href="/vision" className="hover:underline">Nuestra visión</a></li>
            <li><a href="/team" className="hover:underline">Nuestro equipo</a></li>
            <li><a href="/terms" className="hover:underline">Términos y condiciones</a></li>
            <li><a href="/faqs" className="hover:underline">FAQs</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold">Contacto</h3>
          <p className="text-sm mt-3">+57 3177011615</p>
          <p className="text-sm">admin@hospitapp.com</p>
          <p className="text-sm">Medellín, Antioquia, Colombia</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 border-t border-white/30 pt-4 text-center text-sm opacity-80">
        © 2025 HospitAPP, All Rights Reserved
      </div>
    </footer>
  );
}
