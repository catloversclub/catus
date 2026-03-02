const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const globals = require("globals");

module.exports = defineConfig([
  globalIgnores(["dist/*"]),
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/*", ".expo/*"],
  },
  {
    files: ["babel.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    rules: {
      // Enforces the use of specific typing instead of 'any'
      "@typescript-eslint/no-explicit-any": "error",
      // ... other rules
    },
  },
]);
