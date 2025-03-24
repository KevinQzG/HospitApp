"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { allCountries } from "country-telephone-data";

export default function RegisterPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("+57"); // Default: Colombia
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const COUNTRY_CODES = allCountries.map((country) => ({
    code: country.dialCode,
    countryCode: country.iso2,
    name: country.name,
  }));

  const selectedCountryData = COUNTRY_CODES.find(
    (country) => country.code === selectedCountry
  );

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const password = (document.getElementById('password') as HTMLInputElement).value;
      const phone = (document.getElementById('phone') as HTMLInputElement).value;
      const eps = (document.getElementById('eps') as HTMLInputElement).value;
  
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, phone, eps })
      });
  
      const data = await response.json();
  
      if (data.success) {
        setTimeout(() => {
          router.push("/confirmation");
        }, 1500);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  return (
    <section className="flex min-h-screen">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white flex-col justify-center items-center p-10 relative overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400 rounded-full opacity-20"></div>

        <h1 className="text-5xl font-bold mb-6 z-10">HospitAPP</h1>
        <p className="text-xl text-center max-w-md z-10">
          La forma más rápida y segura de encontrar atención médica en Colombia.
        </p>

        <div className="relative z-10 mt-20 w-full flex justify-center">
          <Image
            src="/stock/doctores.png"
            alt="Médicos profesionales"
            width={800}
            height={500}
            className="rounded-lg object-cover"
            priority
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12 bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Crear cuenta
          </h2>
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Iniciar sesión
            </Link>
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                id="email"
                type="email"
                placeholder="Correo electrónico"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 shadow-sm hover:shadow-md transition-shadow relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-2 focus:outline-none"
                >
                  {selectedCountryData && (
                    <ReactCountryFlag
                      countryCode={selectedCountryData.countryCode}
                      svg
                      style={{ width: "1.5em", height: "1.5em" }}
                    />
                  )}
                  <span className="text-gray-700">{selectedCountry}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-64 max-h-64 overflow-y-auto">
                    <ul>
                      {COUNTRY_CODES.map((country, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedCountry(country.code);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <ReactCountryFlag
                            countryCode={country.countryCode}
                            svg
                            style={{ width: "1.5em", height: "1.5em" }}
                          />
                          <span className="text-gray-700">
                            {country.name} ({country.code})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                <input
                  id="phone"
                  type="tel"
                  placeholder="Número de celular"
                  className="w-full pl-2 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <select id="eps" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="">Selecciona tu EPS</option>
                <option value="coosalud">COOSALUD EPS</option>
                <option value="coomeva">COOMEVA EPS</option>
                <option value="saludcoop">SALUDCOOP EPS</option>
                <option value="cafesalud">CAFESALUD EPS</option>
                <option value="crus_blanca">CRUZ BLANCA EPS</option>
                <option value="sura">SURA EPS</option>
                <option value="fundacion_medico_preventiva">
                  FUNDACION MEDICO PREVENTIVA EPS
                </option>
                <option value="condor">CONDOR EPS</option>
                <option value="asmetsalud">ASMETSALUD EPS</option>
                <option value="comfamiliarcamacol">
                  COMFAMILIARCAMACOL EPS
                </option>
                <option value="ecoopsos">ECOOPSOS EPS</option>
                <option value="comfenalco">COMFENALCO EPS</option>
                <option value="nueva">NUEVA EPS</option>
                <option value="aic">AIC EPS</option>
                <option value="emdisalud">EMDISALUD EPS</option>
                <option value="caprecom">CAPRECOM EPS</option>
                <option value="saludtotal">SALUDTOTAL EPS</option>
                <option value="aliansalud">ALIANSALUD EPS</option>
                <option value="confama">COMFAMA EPS</option>
              </select>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Contraseña"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 transition"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Confirmar datos
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}