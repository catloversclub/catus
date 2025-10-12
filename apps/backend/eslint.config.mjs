import { FlatCompat } from "@eslint/eslintrc";
import eslintJS from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginPromise from "eslint-plugin-promise";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import eslintTS from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const flatCompat = new FlatCompat({
  baseDirectory: __dirname,
});

export default eslintTS.config(
  {
    ignores: [
      "**/dist",
      "**/node_modules",
      "**/.pnpm-store",
      "**/__generated__",
      "**/@generated",
      "**/collection",
      "**/.next",
      "**/codegen.ts",
      "**/*.config.{js,mjs,ts}",
      "**/worker/**/*.js",
    ],
  },

  /* Common configuration */
  eslintPluginPrettier,
  eslintJS.configs.recommended,
  ...eslintTS.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": eslintTS.plugin,
    },
    languageOptions: {
      parser: eslintTS.parser,
      parserOptions: {
        project: true,
        emitDecoratorMetadata: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "object-shorthand": ["warn", "always"],
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },

  /* Backend configuration */

  {
    files: ["apps/backend/**/*.ts"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: ["objectLiteralProperty", "classProperty"],
          format: ["camelCase", "PascalCase"],
        },
      ],
    },
  },
  {
    files: ["apps/backend/**/*"],
    rules: {
      "func-style": ["error", "expression"],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["apps/*", "libs/*"],
              message: "Please import with path alias like `@apps/*` or `@libs/*`",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["apps/backend/**/*.spec.ts"],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
);
