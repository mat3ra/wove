import { Made } from "@mat3ra/made";
import { PointsPathFormDataProvider } from "@mat3ra/wode";
import React, { type ComponentType } from "react";

// ---------------------------------------------------------------------------
// Injection point.
//
// The rich Brillouin-zone renderer lives in @mat3ra/move (<BrillouinZoneImage>),
// whose barrel pulls heavy transitive deps (rjsf, simpl-schema). wove does NOT
// depend on it directly — the host app passes it in via BrillouinZoneImageComponent,
// and wove falls back to the plain <img> package-native default below.
// ---------------------------------------------------------------------------

type BrillouinZoneImageProps = {
    latticeType?: string;
    imgSrc?: string;
    description?: string;
};

function DefaultBrillouinZoneImage({ imgSrc, description }: BrillouinZoneImageProps) {
    if (!imgSrc) return null;
    return (
        <img
            className="wove-default-brillouin-zone"
            src={imgSrc}
            alt={description || "Brillouin zone"}
            style={{ maxWidth: "100%" }}
        />
    );
}

interface ExtraComponentProps {
    provider: PointsPathFormDataProvider<any> | unknown;
    description?: string;
    /** Injected by the host app (e.g. @mat3ra/move's BrillouinZoneImage). Defaults to a plain <img>. */
    BrillouinZoneImageComponent?: ComponentType<BrillouinZoneImageProps>;
}

export function ExtraImportantSettingsByContextProvider({
    provider,
    description = "",
    BrillouinZoneImageComponent = DefaultBrillouinZoneImage,
}: ExtraComponentProps) {
    if (provider instanceof PointsPathFormDataProvider) {
        const { material } = provider;
        const latticeType = new Made.Lattice(material.lattice).typeExtended;
        const imgSrc = `/images/brillouin_zone/${latticeType.toLowerCase().replace("_", "-")}.png`;
        return (
            <BrillouinZoneImageComponent
                latticeType={material.Lattice.type}
                imgSrc={imgSrc}
                description={description}
            />
        );
    }

    return null;
}
