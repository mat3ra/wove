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

test("ExtraImportantSettingsByContextProvider passes zone geometry to the injected component", () => {
    const receivedProps: Array<Record<string, unknown>> = [];
    function CapturingComponent(props: Record<string, unknown>) {
        receivedProps.push(props);
        return <div className="captured" />;
    }

    renderToStaticMarkup(
        <ExtraImportantSettingsByContextProvider
            provider={{ name: "kpath", material: { lattice: fccLattice } }}
            description="BZ"
            BrillouinZoneImageComponent={CapturingComponent}
        />,
    );

    assert.strictEqual(receivedProps.length, 1);
    const props = receivedProps[0];
    assert.strictEqual(props.latticeType, "FCC");
    // `faces` is present as a key regardless of the installed made version: components use it to
    // draw the zone, and fall back to `imgSrc` when it is null (made without brillouinZone).
    assert.ok("faces" in props, "faces prop is forwarded to the injected component");
    if (props.faces) {
        const faces = props.faces as Array<{ vertices: number[][]; normal: number[] }>;
        // Face-centered cubic: a truncated octahedron, 8 hexagons plus 6 squares.
        assert.strictEqual(faces.length, 14);
        assert.strictEqual(faces.filter((face) => face.vertices.length === 6).length, 8);
        assert.strictEqual(faces.filter((face) => face.vertices.length === 4).length, 6);
    }
});
