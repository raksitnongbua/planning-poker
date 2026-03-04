import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([{
    extends: [...nextCoreWebVitals],

    plugins: {
        "simple-import-sort": simpleImportSort,
    },

    rules: {
        "simple-import-sort/imports": "warn",
        "simple-import-sort/exports": "warn",
    },
}]);