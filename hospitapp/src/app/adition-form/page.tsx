"use client";

import { useState, FormEvent } from "react";
import { Mail, MessageSquare, X, Building2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      if (!emailRegex.test(value)) return "Correo electrónico inválido";
    }
    if (field === "phone") {
      const phoneRegex = /^\+?\d{7,15}$/;
      if (!phoneRegex.test(value)) return "Teléfono inválido";
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
      if (!res.ok) throw new Error(data.error || "No se pudo enviar el formulario");

      setSuccess(data.message);
      setIpsName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setMessage("");
      setFormErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF] dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      <section className="py-16 md:py-24 container mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto"
        >
          <h1 className="text-4xl font-bold text-center">
            Solicita el registro de tu IPS
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6 mt-10">
            {/* IPS Name */}
            <InputField
              id="ipsName"
              label="Nombre de la IPS"
              Icon={Building2}
              value={ipsName}
              error={formErrors.ipsName}
              onChange={(val) => handleFieldChange("ipsName", val)}
            />
            {/* Address */}
            <InputField
              id="address"
              label="Dirección"
              Icon={Building2}
              value={address}
              error={formErrors.address}
              onChange={(val) => handleFieldChange("address", val)}
            />
            {/* Phone */}
            <InputField
              id="phone"
              label="Teléfono"
              Icon={Phone}
              value={phone}
              error={formErrors.phone}
              onChange={(val) => handleFieldChange("phone", val)}
            />
            {/* Email */}
            <InputField
              id="email"
              label="Correo Electrónico"
              Icon={Mail}
              value={email}
              error={formErrors.email}
              onChange={(val) => handleFieldChange("email", val)}
            />
            {/* Message */}
            <div>
              <label htmlFor="message" className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <MessageSquare className="w-4 h-4" />
                <span>Mensaje</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => handleFieldChange("message", e.target.value)}
                rows={5}
                className={`mt-2 w-full p-3 rounded-xl bg-white dark:bg-gray-800 ${
                  formErrors.message ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
              />
              {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
            </div>

            {/* Success / Error messages */}
            <AnimatePresence>
              {success && (
                <motion.div className="p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg flex justify-between items-center">
                  <p>{success}</p>
                  <button onClick={() => setSuccess(null)}><X className="w-5 h-5" /></button>
                </motion.div>
              )}
              {error && (
                <motion.div className="p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg flex justify-between items-center">
                  <p>{error}</p>
                  <button onClick={() => setError(null)}><X className="w-5 h-5" /></button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 rounded-xl text-white font-semibold shadow-md ${
                isSubmitting ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
            </motion.button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}

function InputField({
  id,
  label,
  Icon,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  Icon: React.ElementType;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full p-3 rounded-xl bg-white dark:bg-gray-800 ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
