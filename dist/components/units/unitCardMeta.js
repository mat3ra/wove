/**
 * What a unit card says about itself beyond its name.
 *
 * With the flowchart ID hidden — it is a UUID that identifies nothing to a reader — a card's
 * subheader was empty, so a canvas of units showed names and nothing else. The engine and flavor
 * a unit runs are what distinguish `pw_scf` from `pw_bands` at a glance, and they are already on
 * the unit.
 *
 * Kept free of React so the shapes it has to survive are testable.
 */
const asText = (value) => (typeof value === "string" ? value.trim() : "");
/**
 * `espresso 6.3 · pw_scf`, dropping whichever half is absent.
 *
 * Prefers the flavor over the executable: a flavor names what the unit *does* (`pw_scf`), where
 * the executable names only the binary (`pw.x`), which is the same for most units of a workflow.
 */
export function describeUnitMeta(unit) {
    var _a, _b;
    const application = unit === null || unit === void 0 ? void 0 : unit.application;
    const name = asText(application === null || application === void 0 ? void 0 : application.name);
    const version = asText(application === null || application === void 0 ? void 0 : application.version);
    const flavor = asText((_a = unit === null || unit === void 0 ? void 0 : unit.flavor) === null || _a === void 0 ? void 0 : _a.name) || asText((_b = unit === null || unit === void 0 ? void 0 : unit.executable) === null || _b === void 0 ? void 0 : _b.name);
    const parts = [[name, version].filter(Boolean).join(" "), flavor].filter(Boolean);
    return parts.join(" · ");
}
/** Types cove ships an icon for; anything else falls back to the generic execution glyph. */
const ICON_BY_TYPE = new Set([
    "assignment",
    "condition",
    "convergence",
    "execution",
    "exit",
    "io",
    "map",
    "processing",
    "reduce",
    "subworkflow",
]);
export function getUnitTypeIconName(type) {
    const name = asText(type);
    return ICON_BY_TYPE.has(name)
        ? `entities.workflow.unitType.${name}`
        : "entities.workflow.unitType.execution";
}
