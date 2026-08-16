/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from "node:assert";
import test from "node:test";

import { humanizePropertyName } from "../src/components/subworkflows/Properties";

test("humanizePropertyName turns schema keys into readable labels", () => {
    assert.strictEqual(humanizePropertyName("total_energy"), "Total energy");
    assert.strictEqual(humanizePropertyName("fermi_energy"), "Fermi energy");
    assert.strictEqual(
        humanizePropertyName("total_energy_contributions"),
        "Total energy contributions",
    );
    assert.strictEqual(humanizePropertyName("pressure"), "Pressure");
});

test("humanizePropertyName leaves already-readable names alone", () => {
    assert.strictEqual(humanizePropertyName("Band structure"), "Band structure");
    assert.strictEqual(humanizePropertyName(""), "");
});
