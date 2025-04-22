import "@/styles/globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PwaHandler from "@/components/PwaHandler";
import { AuthProvider } from "@/context/AuthContext";


export const metadata: Metadata = {
  title: "HospitApp",
  description:
    "The fastest, safest, and smartest way to find medical care in Antioquia, Colombia.",
  manifest: "/manifest.json",
};

export default function rootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <head>
        {/* Icons and PWA meta tags */}
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/icons/icon-48x48.png"
        />
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1D4ED8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="HospitAPP" />
        <meta name="application-name" content="HospitAPP" />
      </head>
      
      <body className="min-h-screen bg-[#ECF6FF] text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <AuthProvider>
      <Header />
        <main>{children}</main>
        <Footer />  
        <PwaHandler />
        {/* Apply saved theme on first load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem("theme") || "light";
                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              })();
            `,
          }}
        />
        </AuthProvider>
      </body>
      
    </html>
  );
}
