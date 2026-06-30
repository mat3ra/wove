import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

/**
 * Vite config for the wove package.
 *
 * When running as a standalone demo app (`npm run dev`), the full module graph
 * is resolved, including components that import /imports/* Meteor paths (now
 * eliminated) and optional peers.  Aliases below ensure the standalone Vite
 * server works without the full Meteor environment.
 *
 * The `build` target (`npm run build`) continues to emit the transpiled
 * library to `build/`.
 */
export default defineConfig({
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
    optimizeDeps: {
        exclude: [
            // Only exclude the self-referencing package and packages not installed
            // in wove's node_modules.  Everything else must be pre-bundled so
            // that Vite performs CJS→ESM conversion and named imports work.
            "@mat3ra/wove",
            "@mat3ra/prode",
        ],
    },
    resolve: {
        alias: [
            // React aliases — point to the workflow-designer's node_modules
            // because wove lists react only as a peerDependency and doesn't
            // have it locally installed.
            {
                find: "react/jsx-runtime",
                replacement: path.resolve(__dirname, "../workflow-designer/node_modules/react/jsx-runtime.js"),
            },
            {
                find: "react/jsx-dev-runtime",
                replacement: path.resolve(__dirname, "../workflow-designer/node_modules/react/jsx-dev-runtime.js"),
            },
            {
                find: /^react$/,
                replacement: path.resolve(__dirname, "../workflow-designer/node_modules/react/index.js"),
            },
            {
                find: /^react-dom$/,
                replacement: path.resolve(__dirname, "../workflow-designer/node_modules/react-dom/index.js"),
            },
            {
                find: "use-sync-external-store/shim/with-selector.js",
                replacement: "use-sync-external-store/shim/with-selector",
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
            // @mat3ra/code — alias to wove's own installed version so Vite pre-bundles
            // it (CJS→ESM). Without this, files outside the project root (e.g. move/dist)
            // resolve to move's local @mat3ra/code and it's served as raw CJS, breaking
            // named imports like getSchemaWithDependencies.
            {
                find: "@mat3ra/code",
                replacement: path.resolve(__dirname, "node_modules/@mat3ra/code"),
            },
            // @mat3ra/wode — same reason: alias to wove's installed version so the
            // CJS-based enums/classes get pre-bundled and named imports (UnitType, etc.) work.
            {
                find: "@mat3ra/wode",
                replacement: path.resolve(__dirname, "node_modules/@mat3ra/wode"),
            },
            // @exabyte-io/cove.js/dist — point all subpath imports to the local
            // reference/cove.js/dist so components added after wove's installed
            // cove.js version (2026.5.28-0) are available (e.g. LoadingIndicator).
            {
                find: "@exabyte-io/cove.js/dist/",
                replacement: path.resolve(__dirname, "../cove.js/dist/"),
            },
            // @mat3ra/move and @mat3ra/ave — point to minimal shims inside the
            // wove project root (so Vite alias resolution applies to their imports).
            // The full barrels pull in PseudoForm/ExecutionUnit which need
            // @mat3ra/prode and @mat3ra/prove, not installed in wove.
            {
                find: "@mat3ra/move",
                replacement: path.resolve(__dirname, "src/standalone/stubs/move-shim.js"),
            },
            {
                find: "@mat3ra/ave",
                replacement: path.resolve(__dirname, "src/standalone/stubs/ave-shim.js"),
            },
            // Packages pulled in transitively via ave's ExecutionUnit that we stub out.
            {
                find: "@mat3ra/prode/",
                replacement: path.resolve(__dirname, "../move/node_modules/@mat3ra/prode/"),
            },
            {
                find: "@mat3ra/prode",
                replacement: path.resolve(__dirname, "src/standalone/stubs/meteor.js"),
            },
            {
                find: "@mat3ra/prove",
                replacement: path.resolve(__dirname, "src/standalone/stubs/meteor.js"),
            },
            {
                find: "@mat3ra/workflow-designer",
                replacement: path.resolve(__dirname, "src/standalone/stubs/meteor.js"),
            },
            // @mat3ra/made and @mat3ra/ide — not installed in wove; needed as stubs
            // so esbuild can pre-bundle @mat3ra/wode (which requires them at module
            // load time). At runtime these code paths aren't hit in the standalone viewer.
            // Use regex to catch all subpath imports (e.g. @mat3ra/ide/dist/js/compute).
            {
                find: "@mat3ra/made",
                replacement: path.resolve(__dirname, "src/standalone/stubs/meteor.js"),
            },
            // @mat3ra/ide/dist/js/compute — the real ide dist needs 'pluralize' and
            // 'moment' which aren't installed in wove. Use a minimal stub that
            // provides computedEntityMixin as a no-op.
            {
                find: "@mat3ra/ide/dist/js/compute",
                replacement: path.resolve(__dirname, "src/standalone/stubs/ide-compute-stub.js"),
            },
            {
                find: /^@mat3ra\/ide(\/.*)?$/,
                replacement: path.resolve(__dirname, "src/standalone/stubs/meteor.js"),
            },
            // Catch-all for any remaining /imports/* Meteor paths that may be
            // transitively pulled in via peer packages.
            {
                find: /^\/imports\/(.*)$/,
                replacement: path.resolve(__dirname, "src/standalone/stubs/meteor.js"),
            },
            {
                find: /^meteor\/(.*)$/,
                replacement: path.resolve(__dirname, "src/standalone/stubs/meteor.js"),
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
