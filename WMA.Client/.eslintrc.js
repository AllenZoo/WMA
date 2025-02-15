// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["@typescript-eslint", "import", "prettier"],
  parser: "@typescript-eslint/parser",
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
        extensions: [".ts", ".tsx"],
      },
    },
  },
  rules: {
    "@typescript-eslint/no-var-requires": "off",
    "prettier/prettier": [
      "warn",
      {
        useTabs: false,
        tabWidth: 2,
        trailingComma: "es5",
        singleAttributePerLine: true,
        endOfLine: "auto",
      },
    ],
    "import/no-unresolved": "error",
  },
};
