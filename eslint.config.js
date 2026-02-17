import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import litPlugin from "eslint-plugin-lit";

export default tseslint.config(
  { ignores: ["dist"] },
  ...tseslint.configs.recommended,
  litPlugin.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
