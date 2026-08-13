/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from "node:assert";
import test from "node:test";

import { Utils } from "@mat3ra/utils";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ExtraImportantSettingsByContextProvider } from "../src/context/utils";

/**
 * wove's @mat3ra/utils puts helpers under `Utils.math.default`; made's Lattice.typeExtended
 * expects `Utils.math.cos` / `PI` (as in web-app). Patch for this package's unit tests.
 */
Object.assign(Utils.math, Utils.math.default ?? {}, {
    cos: Math.cos,
    sin: Math.sin,
    PI: Math.PI,
});

const fccLattice = {
    type: "FCC",
    a: 5.0,
    b: 5.0,
    c: 5.0,
    alpha: 90,
    beta: 90,
    gamma: 90,
};

test("ExtraImportantSettingsByContextProvider renders Brillouin zone image for kpath", () => {
    const html = renderToStaticMarkup(
        <ExtraImportantSettingsByContextProvider
            provider={{
                name: "kpath",
                material: { lattice: fccLattice },
            }}
            description="BZ"
        />,
    );

    assert.match(html, /wove-default-brillouin-zone/);
    assert.match(html, /\/images\/brillouin_zone\/fcc\.png/);
    assert.match(html, /alt="BZ"/);
});

test("ExtraImportantSettingsByContextProvider returns null for non-points-path providers", () => {
    const html = renderToStaticMarkup(
        <ExtraImportantSettingsByContextProvider
            provider={{
                name: "startingMagnetization",
                material: { lattice: fccLattice },
            }}
        />,
    );

    assert.strictEqual(html, "");
});
