const jsdoc = require("eslint-plugin-jsdoc");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const nextConfig = require("eslint-config-next").flat;

module.exports = [
  ...nextConfig, 
  {
    plugins: {
      "@typescript-eslint": tsPlugin,
      jsdoc: jsdoc,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "variable", format: ["snake_case"] },
        { selector: "variable", modifiers: ["const"], format: ["UPPER_CASE"], prefix: ["_"] },
        { selector: "function", format: ["snake_case"] }
      ],
      camelcase: "off",
      "no-restricted-imports": ["error", { patterns: ["../components/*"] }]
    }
  }
];
