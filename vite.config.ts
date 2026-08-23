import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

/**
 * Vite config for the wove standalone demo app.
 *
 * This is ONLY used for local development (`npm run dev`) and the
 * standalone build (`npm run build:standalone`).
 * The library build (tsc) ignores this file entirely.
 *
 * Kept in sync with the canonical @mat3ra/ave and @mat3ra/ive configs:
 * minimal dedupe, no optimizeDeps overrides, and NO stubs for the @mat3ra/*
 * data packages (made/code/ide/mode/ade/prode/prove) or the sibling *ve
 * packages (ave/move). Those all bundle and run in the browser when the
 * correct, mutually-consistent versions are installed and Vite is left to do
 * its default CJS→ESM pre-bundling — see the jove/ave configs for the same
 * pattern. The stubs this file used to carry were caused by ide/prode/prove
 * simply not being installed (never declared), which is now fixed in
 * package.json.
 */
export default defineConfig({
    base: "/wove/",
    plugins: [
        react({
            jsxImportSource: "@emotion/react",
            babel: {
                plugins: ["@emotion/babel-plugin"],
            },
        }),
        nodePolyfills(),
    ],
    define: {
        __dirname: JSON.stringify(__dirname),
    },
    server: {
        port: 3007,
    },
    resolve: {
        dedupe: ["@mat3ra/esse", "@mui/material", "@mui/styles", "@emotion/react", "@emotion/styled"],
        alias: [
            {
                find: /^vite-plugin-node-polyfills\/shims\/(.*)$/,
                replacement: path.resolve(__dirname, "node_modules/vite-plugin-node-polyfills/shims/$1"),
            },
            // Self-referencing alias so the standalone demo can import from
            // "@mat3ra/wove" and resolve to the local source tree.
            {
                find: /^@mat3ra\/wove$/,
                replacement: path.resolve(__dirname, "src/exports.ts"),
            },
            {
                find: /^@mat3ra\/wove\/dist\/(.*)$/,
                replacement: path.resolve(__dirname, "src/$1"),
            },
            // MUI ESM fixes.
            {
                find: /^@mui\/system\/(?!esm\/)(.*)$/,
                replacement: path.resolve(__dirname, "node_modules/@mui/system/esm/$1"),
            },
            {
                find: /^@mui\/icons-material\/(?!esm\/)(.*)$/,
                replacement: path.resolve(__dirname, "node_modules/@mui/icons-material/esm/$1"),
            },
            // lodash → lodash-es for tree-shaking.
            {
                find: /^lodash\/(?!es\/)(.*)$/,
                replacement: path.resolve(__dirname, "node_modules/lodash-es/$1.js"),
            },
        ],
    },
    build: {
        outDir: "build",
        rollupOptions: {
            output: {
                entryFileNames: "main.js",
                chunkFileNames: "[name]-[hash].js",
                // Stable name so a host page can load the stylesheet by URL, the way
                // wave.js' main.css is loaded: https://mat3ra.github.io/wove/main.css
                assetFileNames: "main.[ext]",
            },
        },
    },
});
