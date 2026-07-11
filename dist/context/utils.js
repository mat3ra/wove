import { jsx as _jsx } from "react/jsx-runtime";
import { Made } from "@mat3ra/made";
import { PointsPathFormDataProvider } from "@mat3ra/wode";
function DefaultBrillouinZoneImage({ imgSrc, description }) {
    if (!imgSrc)
        return null;
    return (_jsx("img", { className: "wove-default-brillouin-zone", src: imgSrc, alt: description || "Brillouin zone", style: { maxWidth: "100%" } }));
}
export function ExtraImportantSettingsByContextProvider({ provider, description = "", BrillouinZoneImageComponent = DefaultBrillouinZoneImage, }) {
    if (provider instanceof PointsPathFormDataProvider) {
        const { material } = provider;
        const latticeType = new Made.Lattice(material.lattice).typeExtended;
        const imgSrc = `/images/brillouin_zone/${latticeType.toLowerCase().replace("_", "-")}.png`;
        return (_jsx(BrillouinZoneImageComponent, { latticeType: material.Lattice.type, imgSrc: imgSrc, description: description }));
    }
    return null;
}
