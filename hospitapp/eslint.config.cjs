const jsdoc = require("eslint-plugin-jsdoc");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const next = require("eslint-config-next");


module.exports = [
  ...next,
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

