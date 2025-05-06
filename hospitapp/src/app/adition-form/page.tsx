"use client";

import { useState, FormEvent } from "react";
import {
  Mail,
  MessageSquare,
  X,
  Building2,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function IPSRequestForm() {
  const [ipsName, setIpsName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string) => {
    if (!value) return "Este campo es obligatorio";
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value))
        return "Por favor, introduce un correo electrónico válido";
    }
    if (field === "phone") {
      const phoneRegex = /^\+?\d{7,15}$/;
      if (!phoneRegex.test(value))
        return "Por favor, introduce un número de teléfono válido";
    }
    return "";
  };

  const handleFieldChange = (field: string, value: string) => {
    const error = validateField(field, value);
    setFormErrors((prev) => ({ ...prev, [field]: error }));

    switch (field) {
      case "ipsName":
        setIpsName(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "message":
        setMessage(value);
        break;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    const fields = { ipsName, address, phone, email, message };
    const errors: { [key: string]: string } = {};

    for (const [key, value] of Object.entries(fields)) {
      errors[key] = validateField(key, value);
    }

    setFormErrors(errors);
    if (Object.values(errors).some((e) => e)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/v1.0.0/ips/require-create-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "No se pudo enviar el formulario");

      setSuccess(data.message);
      setIpsName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setMessage("");
      setFormErrors({});
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error desconocido"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen font-sans">
      <section className="relative pt-6 md:pt-10 pb-16 md:pb-24 transition-colors duration-300">
        <div className="relative container mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mb-10"
            >
              <Link
                href="/results"
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#111827] dark:bg-gray-800 text-blue-500 hover:text-blue-400 transition-colors font-semibold shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver a Resultados
              </Link>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Solicita el Registro de tu IPS
              <br />
              <span className="text-blue-800 dark:text-blue-400">
                Completa el Formulario
              </span>
            </h1>
            <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-prose mx-auto leading-relaxed">
              Ingresa los detalles de tu IPS para solicitar su registro. Nos
              comunicaremos contigo pronto para continuar con el proceso.
            </p>

            <div className="w-full max-w-lg mt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  id="ipsName"
                  label="Nombre de la IPS"
                  Icon={Building2}
                  value={ipsName}
                  error={formErrors.ipsName}
                  onChange={(val) => handleFieldChange("ipsName", val)}
                />
                <InputField
                  id="address"
                  label="Dirección"
                  Icon={Building2}
                  value={address}
                  error={formErrors.address}
                  onChange={(val) => handleFieldChange("address", val)}
                />
                <InputField
                  id="phone"
                  label="Teléfono"
                  Icon={Phone}
                  value={phone}
                  error={formErrors.phone}
                  onChange={(val) => handleFieldChange("phone", val)}
                />
                <InputField
                  id="email"
                  label="Correo Electrónico"
                  Icon={Mail}
                  value={email}
                  error={formErrors.email}
                  onChange={(val) => handleFieldChange("email", val)}
                />
                <div>
                  <label
                    htmlFor="message"
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Detalles Adicionales</span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) =>
                      handleFieldChange("message", e.target.value)
                    }
                    rows={5}
                    className={`mt-2 w-full p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 resize-none ${
                      formErrors.message
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                    aria-invalid={!!formErrors.message}
                    aria-describedby={
                      formErrors.message ? "message-error" : undefined
                    }
                  />
                  {formErrors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-500">
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700"
                    >
                      <p>{success}</p>
                      <button
                        onClick={() => setSuccess(null)}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700"
                    >
                      <p>{error}</p>
                      <button
                        onClick={() => setError(null)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-4 rounded-xl text-white font-semibold shadow-md transition-colors flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? "bg-blue-400 cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <span>Enviar Solicitud</span>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

interface InputFieldProps {
  id: string;
  label: string;
  Icon: React.ElementType;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function InputField({
  id,
  label,
  Icon,
  value,
  error,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </label>
      <input
        type={id === "email" ? "email" : id === "phone" ? "tel" : "text"}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
