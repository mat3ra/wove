/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

/**
 * Regression: Important settings crashed with
 * `Cannot read properties of undefined (reading 'type')` at
 * `material.Lattice.type` when web-app pinned SOF-7926 made (`getLattice()` only).
 * Prefer `Made.Lattice(material.lattice)` so plain lattice JSON works.
 */
test("ExtraImportantSettings does not read material.Lattice", () => {
    const utilsPath = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "../src/context/utils.tsx",
    );
    const source = fs.readFileSync(utilsPath, "utf8");

    assert.doesNotMatch(
        source,
        /material\.Lattice\b/,
        "must not use material.Lattice (broken under made getLattice()-only API)",
    );
    assert.match(source, /Made\.Lattice\(/);
    assert.match(source, /getBrillouinZoneImagePropsFromMaterial/);
});
