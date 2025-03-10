import "@/styles/globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PwaHandler from "@/components/PwaHandler";

export const metadata: Metadata = {
  title: "HospitApp",
  description:
    "The fastest, safest, and smartest way to find medical care in Antioquia, Colombia.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Favicon browser*/}
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/icons/icon-48x48.png"
        />

        {/* Apple Touch Icons para iOS */}
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />

        {/* Android Chrome Icons */}
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />

        {/* Manifest para PWA */}
        <link rel="manifest" href="/manifest.json" />

        {/* Meta etiquetas para Android y PWA */}
        <meta name="theme-color" content="#00381F" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="HospitAPP" />
        <meta name="application-name" content="HospitAPP" />
      </head>
      <body className="bg-[#ECF6FF]">
        <Header />
        <main>{children}</main>
        <Footer />
        <PwaHandler />
      </body>
    </html>
  );
}
