/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from "node:assert";
import test from "node:test";

import { describeUnitMeta, getUnitTypeIconName } from "../src/components/units/unitCardMeta";

/** Shaped like a rendered execution unit from wode. */
const PW_SCF = {
    type: "execution",
    application: { name: "espresso", version: "6.3" },
    executable: { name: "pw.x" },
    flavor: { name: "pw_scf" },
};

test("a card states the engine and what the unit does with it", () => {
    assert.strictEqual(describeUnitMeta(PW_SCF), "espresso 6.3 · pw_scf");
});

test("the flavor wins over the executable, which is the same across most units", () => {
    // Every espresso unit of a band-structure workflow runs pw.x; only the flavor separates them.
    assert.strictEqual(
        describeUnitMeta({ ...PW_SCF, flavor: { name: "pw_bands" } }).endsWith("pw_bands"),
        true,
    );
    assert.strictEqual(describeUnitMeta({ ...PW_SCF, flavor: undefined }), "espresso 6.3 · pw.x");
});

test("whichever half is missing is dropped rather than left dangling", () => {
    assert.strictEqual(describeUnitMeta({ application: { name: "vasp" } }), "vasp");
    assert.strictEqual(describeUnitMeta({ flavor: { name: "custom" } }), "custom");
    assert.strictEqual(describeUnitMeta({ application: { version: "6.3" } }), "6.3");
});

test("a unit with nothing to say produces an empty string, not 'undefined'", () => {
    assert.strictEqual(describeUnitMeta({}), "");
    assert.strictEqual(describeUnitMeta(undefined), "");
    assert.strictEqual(describeUnitMeta({ application: {}, flavor: {} }), "");
});

test("non-string values do not leak into the label", () => {
    assert.strictEqual(
        describeUnitMeta({
            application: { name: 42 as unknown as string },
            flavor: { name: null },
        }),
        "",
    );
});

test("each type cove ships an icon for resolves to its own icon", () => {
    ["execution", "subworkflow", "map", "assignment", "condition", "io", "processing"].forEach(
        (type) => {
            assert.strictEqual(getUnitTypeIconName(type), `entities.workflow.unitType.${type}`);
        },
    );
});

test("types without an icon fall back rather than resolving to nothing", () => {
    // cove has no glyph for these; an unknown key would render blank.
    assert.strictEqual(getUnitTypeIconName("assertion"), "entities.workflow.unitType.execution");
    assert.strictEqual(getUnitTypeIconName(undefined), "entities.workflow.unitType.execution");
    assert.strictEqual(getUnitTypeIconName(""), "entities.workflow.unitType.execution");
});
