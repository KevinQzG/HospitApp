import jsdoc from "eslint-plugin-jsdoc";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import next from "eslint-config-next";

export default [
  // Configuración base de Next.js
  ...next,

  // Configuración para TypeScript
  {
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      jsdoc: jsdoc,
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "variable", format: ["snake_case"] },
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["UPPER_CASE"],
          prefix: ["_"],
        },
        { selector: "function", format: ["snake_case"] },
      ],
      camelcase: "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: ["../components/*"],
        },
      ],
    },
  },
];
