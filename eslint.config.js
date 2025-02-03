import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Include Node.js globals
      },
      ecmaVersion: 2021,
      sourceType: "module", // Enable ES Modules
    },
    rules: {
      "indent": ["error", 2], // Use 2 spaces for indentation
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Warn for unused variables
      "no-console": "off", // Allow console.log
    },
  },
];
