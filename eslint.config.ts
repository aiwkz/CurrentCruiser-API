import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      '.serverless/',
      'dist/',
      'build/',
      'node_modules/',
    ],
  },
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
      "no-console": "error",
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
      "@typescript-eslint/no-floating-promises": "error"
    },
  },
];
