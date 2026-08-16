import { jsx as _jsx } from "react/jsx-runtime";
import { Made } from "@mat3ra/made";
function DefaultBrillouinZoneImage({ imgSrc, description }) {
    if (!imgSrc)
        return null;
    return (_jsx("img", { className: "wove-default-brillouin-zone", src: imgSrc, alt: description || "Brillouin zone", style: { maxWidth: "100%" } }));
}
const POINTS_PATH_PROVIDER_NAMES = ["kpath", "qpath", "explicitKPath"];
// Use the provider's schema `name`, not `instanceof`: job/workflow units are built via
// Meteor-compiled `@mat3ra/wode` (see `rspack.config.js` `compileWithMeteor`); wove UI may
// resolve another copy of the same class, so `instanceof PointsPathFormDataProvider` is false
// even for a real kpath/qpath/explicitKPath provider (mirrors `isExecutionUnit` in
// workflow-designer's `ImportantSettings.tsx`, which hit the same issue for `ExecutionUnit`).
function isPointsPathProvider(provider) {
    return (typeof provider === "object" &&
        provider !== null &&
        POINTS_PATH_PROVIDER_NAMES.includes(provider.name));
}
/**
 * Resolve lattice type + Brillouin-zone image path from a points-path provider material.
 * Prefer schema `lattice` JSON over Material getters (`Lattice` / `getLattice`) so this works
 * across made API renames and plain material configs.
 *
 * TODO: Do not hardcode web-app public paths here (`/images/brillouin_zone/...`). Own the
 * assets in materials-designer (or another UI package) and inject `imgSrc` / the image
 * component from the host so wove stays path-agnostic.
 */
export function getBrillouinZoneImagePropsFromMaterial(material) {
    const lattice = new Made.Lattice(material.lattice);
    const latticeTypeExtended = lattice.typeExtended;
    return {
        latticeType: lattice.type,
        // TODO: replace web-app path; see JSDoc above.
        imgSrc: `/images/brillouin_zone/${latticeTypeExtended.toLowerCase().replace("_", "-")}.png`,
    };
}
export function ExtraImportantSettingsByContextProvider({ provider, description = "", BrillouinZoneImageComponent = DefaultBrillouinZoneImage, }) {
    if (isPointsPathProvider(provider)) {
        const { latticeType, imgSrc } = getBrillouinZoneImagePropsFromMaterial(provider.material);
        return (_jsx(BrillouinZoneImageComponent, { latticeType: latticeType, imgSrc: imgSrc, description: description }));
    }
    return null;
}
