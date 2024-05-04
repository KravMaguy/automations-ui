import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        chrome: true,
      },
    },
  },
  pluginJs.configs.recommended,
];
