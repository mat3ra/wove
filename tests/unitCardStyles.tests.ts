/* eslint-disable @typescript-eslint/no-floating-promises */
import { createTheme } from "@mui/material/styles";
import assert from "node:assert";
import test from "node:test";

import { getUnitCardBorderColors } from "../src/components/units/UnitCard.styled";

const lightTheme = createTheme({ palette: { mode: "light" } });
const darkTheme = createTheme({ palette: { mode: "dark" } });

/** cove 2026.8+ merges these onto the theme; older pins have nothing under `designer`. */
const withDesignerTokens = (mode: "light" | "dark") =>
    Object.assign(createTheme({ palette: { mode } }), {
        designer: {
            canvas: { selection: "#5b37c0" },
            node: { background: mode === "dark" ? "#1A1A1F" : "#FFFFFF" },
        },
    });

test("the resting border follows the surface instead of being literally white", () => {
    // The bug: on a dark canvas, `"4px solid white"` framed every unselected card.
    assert.strictEqual(
        getUnitCardBorderColors(darkTheme).resting,
        darkTheme.palette.background.paper,
    );
    assert.notStrictEqual(getUnitCardBorderColors(darkTheme).resting, "white");
});

test("on a light theme the resting border is still effectively invisible", () => {
    const { resting } = getUnitCardBorderColors(lightTheme);
    assert.strictEqual(resting, lightTheme.palette.background.paper);
    assert.strictEqual(resting, "#fff");
});

test("designer tokens win over the palette when the installed cove provides them", () => {
    assert.strictEqual(getUnitCardBorderColors(withDesignerTokens("dark")).resting, "#1A1A1F");
    assert.strictEqual(getUnitCardBorderColors(withDesignerTokens("dark")).selected, "#5b37c0");
});

test("without designer tokens the selected border keeps its previous value", () => {
    assert.strictEqual(getUnitCardBorderColors(darkTheme).selected, darkTheme.palette.primary.dark);
});

test("resting and selected differ, or selection would be invisible", () => {
    [lightTheme, darkTheme, withDesignerTokens("light"), withDesignerTokens("dark")].forEach(
        (theme) => {
            const { resting, selected } = getUnitCardBorderColors(theme);
            assert.notStrictEqual(resting, selected);
        },
    );
});
