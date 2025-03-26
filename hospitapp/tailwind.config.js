/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        apple: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        primary: "#2563eb",
        secondary: "#1e40af",
        background: "#f9fafb",
        text: "#1f2937",
        white: "#ffffff",
      },
    },
  },
  plugins: [],
};
