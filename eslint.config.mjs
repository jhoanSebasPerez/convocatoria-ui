import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",  // Permite usar 'any'
      "@typescript-eslint/no-unused-vars": "off",   // No marca variables no usadas
      "react-hooks/exhaustive-deps": "off",        // Solo advierte sobre dependencias faltantes
      "react/display-name": "off",   // Desactiva la advertencia de dependencias faltantes
      "@typescript-eslint/ban-ts-comment": "off", // Desactiva la advertencia de dependencias faltantes
      "eslint-disable": "off", // Desactiva la advertencia de dependencias faltantes
      "import/no-anonymous-default-export": "off", // Desactiva la advertencia de dependencias faltantes
      "import/no-unresolved": "off",
      "import/prefer-default-export": "off",
      "@typescript-eslint/no-empty-object-type": "off"// Desactiva la advertencia de dependencias faltantes
    },
  },
];

export default eslintConfig;