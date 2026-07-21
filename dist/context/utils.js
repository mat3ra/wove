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
export function ExtraImportantSettingsByContextProvider({ provider, description = "", BrillouinZoneImageComponent = DefaultBrillouinZoneImage, }) {
    if (isPointsPathProvider(provider)) {
        const { material } = provider;
        const latticeType = new Made.Lattice(material.lattice).typeExtended;
        const imgSrc = `/images/brillouin_zone/${latticeType.toLowerCase().replace("_", "-")}.png`;
        return (_jsx(BrillouinZoneImageComponent, { latticeType: material.Lattice.type, imgSrc: imgSrc, description: description }));
    }
    return null;
}
