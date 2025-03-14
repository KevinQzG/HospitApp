export default [
  {
    ignores: ["node_modules/", "dist/"],
  },
  {
    extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      jsdoc: require("eslint-plugin-jsdoc"),
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["snake_case"]
        },
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["UPPER_CASE"],
          prefix: ["_"]
        },
        {
          selector: "function",
          format: ["snake_case"]
        }
      ],
      camelcase: "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: ["../components/*"]
        }
      ]
    }
  }
];
