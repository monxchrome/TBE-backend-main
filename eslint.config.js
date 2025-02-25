import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginTS from "@typescript-eslint/eslint-plugin";
import eslintParserTS from "@typescript-eslint/parser";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importPlugin from "eslint-plugin-import";

export default [
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: eslintParserTS,
            parserOptions: {
                project: "tsconfig.json",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": eslintPluginTS,
            "prettier": eslintPluginPrettier,
            "simple-import-sort": simpleImportSort,
            "import": importPlugin,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "req|res|next" }],
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "simple-import-sort/imports": "error",
            "import/first": "error",
            "import/newline-after-import": ["error", { "count": 1 }],
            "import/no-duplicates": "error",
            "no-console": "warn",
            "sort-imports": ["error", {
                "ignoreCase": true,
                "ignoreDeclarationSort": true,
                "ignoreMemberSort": false,
                "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
                "allowSeparatedGroups": false
            }],
        },
    },
];
