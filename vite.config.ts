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
            // Stubs for packages that pull in Meteor/prode transitive deps
            // not available in the standalone environment.
            {
                find: "@mat3ra/move",
                replacement: path.resolve(__dirname, "src/standalone/stubs/move-shim.js"),
            },
            {
                find: "@mat3ra/ave",
                replacement: path.resolve(__dirname, "src/standalone/stubs/ave-shim.js"),
            },
            {
                find: /^@mat3ra\/prode$/,
                replacement: path.resolve(__dirname, "src/standalone/stubs/meteor.js"),
            },
            {
                find: "@mat3ra/prove",
                replacement: path.resolve(__dirname, "src/standalone/stubs/meteor.js"),
            },
            {
                find: "@mat3ra/made",
                replacement: path.resolve(__dirname, "src/standalone/stubs/meteor.js"),
            },
            {
                find: "@mat3ra/ide/dist/js/compute",
                replacement: path.resolve(__dirname, "src/standalone/stubs/ide-compute-stub.js"),
            },
            {
                find: /^@mat3ra\/ide(\/.*)?$/,
                replacement: path.resolve(__dirname, "src/standalone/stubs/meteor.js"),
            },
            // MUI ESM fixes
            {
                find: /^@mui\/system\/(?!esm\/)(.*)$/,
                replacement: path.resolve(__dirname, "node_modules/@mui/system/esm/$1"),
            },
            {
                find: /^@mui\/icons-material\/(?!esm\/)(.*)$/,
                replacement: path.resolve(__dirname, "node_modules/@mui/icons-material/esm/$1"),
            },
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
                assetFileNames: "[name]-[hash].[ext]",
            },
        },
    },
    server: {
        port: 3007,
    },
});
