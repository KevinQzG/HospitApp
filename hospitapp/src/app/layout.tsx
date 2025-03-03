import "@/styles/globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "HospitAPP",
  description: "The fastest, safest, and smartest way to find medical care in Antioquia, Colombia.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="bg-gray-50 text-gray-900 font-sans">
        <Header />
        <main className="max-w-7xl mx-auto px-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
