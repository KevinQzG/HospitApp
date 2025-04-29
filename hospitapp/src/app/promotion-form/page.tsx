"use client";

import { useState, FormEvent, useEffect } from "react";
import { User, Mail, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PromotionFormPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string) => {
    if (!value) {
      return "Este campo es obligatorio";
    }
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Por favor, introduce un correo electrónico válido";
      }
    }
    return "";
  };

  const handleFieldChange = (field: string, value: string) => {
    const error = validateField(field, value);
    setFormErrors((prev) => ({ ...prev, [field]: error }));
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "message") setMessage(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    // Validate all fields
    const errors: { [key: string]: string } = {};
    errors.name = validateField("name", name);
    errors.email = validateField("email", email);
    errors.message = validateField("message", message);

    setFormErrors(errors);
    if (Object.values(errors).some((error) => error)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/v1.0.0/ips/promotion-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo enviar el formulario");
      }

      setSuccess(data.message);
      setName("");
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
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 transition-colors duration-300">
        <div className="relative container mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              ¡Promociona tu IPS!
              <br />
              <span className="text-blue-800 dark:text-blue-400">
                Ponte en Contacto
              </span>
            </h1>
            <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-prose mx-auto leading-relaxed">
              Completa el formulario para compartir los detalles de tu IPS y la
              promoción que deseas realizar. Nos pondremos en contacto contigo
              pronto.
            </p>

            <div className="w-full max-w-lg mt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <User className="w-4 h-4" />
                    <span>Nombre</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className={`mt-2 w-full p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 ${
                      formErrors.name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    }`}
                    aria-invalid={!!formErrors.name}
                    aria-describedby={formErrors.name ? "name-error" : undefined}
                  />
                  {formErrors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-500">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Correo Electrónico</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className={`mt-2 w-full p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 ${
                      formErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    }`}
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-500">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Detalles de la Promoción</span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => handleFieldChange("message", e.target.value)}
                    rows={5}
                    className={`mt-2 w-full p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 resize-none ${
                      formErrors.message ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    }`}
                    aria-invalid={!!formErrors.message}
                    aria-describedby={formErrors.message ? "message-error" : undefined}
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
                    <span>Enviar Formulario</span>
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