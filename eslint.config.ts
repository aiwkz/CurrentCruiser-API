import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config} */
export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      ecmaVersion: 2021,
    },
    rules: {
      indent: ["error", 2],
      "no-console": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  }
);
