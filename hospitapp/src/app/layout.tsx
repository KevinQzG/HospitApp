import "@/styles/globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "HospitApp",
  description: "The fastest, safest, and smartest way to find medical care in Antioquia, Colombia.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ECF6FF" />
      </head>
      <body className="bg-[#ECF6FF]">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}