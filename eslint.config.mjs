import js from "@eslint/js";
import globals from "globals";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.ts"],
    extends: tsEslint.configs.recommendedTypeChecked,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
