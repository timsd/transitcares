import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "convex/_generated",
      "tests",
      "src/routeTree.gen.ts",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [eslintJs.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  }
);
