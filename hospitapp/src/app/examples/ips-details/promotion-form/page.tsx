// hospitapp/src/pages/promotion-form.tsx
"use client";

import { useState, FormEvent } from "react";

export default function PromotionFormPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    // Client-side validation
    if (!name || !email || !message) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
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
        throw new Error(data.error || "Failed to submit form");
      }

      setSuccess(data.message);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#ECF6FF] dark:bg-[#0f172a] overflow-hidden py-14 md:py-20 transition-colors duration-300">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ECF6FF]/80 to-[#D1E8FF]/60 dark:from-blue-950/60 dark:to-sky-900/40 opacity-50"></div>

          <div className="relative flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              ¡Promociona tu IPS!
              <br />
              <span className="text-blue-800 dark:text-blue-400">Ponte en Contacto</span>
            </h1>
            <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-prose mx-auto">
			  Completa el siguiente formulario para compartir los detalles de tu IPS y el detallet de la promoción que deseas realizar. Estaremos en contacto contigo pronto.
            </p>

            <div className="w-full max-w-md mt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Detalles de la Promoción
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="mt-1 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {success && (
                  <p className="text-green-600 dark:text-green-400">{success}</p>
                )}
                {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors ${
                    isSubmitting
                      ? "bg-blue-400 cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}