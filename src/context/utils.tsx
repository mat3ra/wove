import { Made } from "@mat3ra/made";
import { PointsPathFormDataProvider } from "@mat3ra/wode";
import React from "react";

import { BrillouinZoneImage } from "@mat3ra/move";

interface ExtraComponentProps {
    provider: PointsPathFormDataProvider<any> | unknown;
    description?: string;
}

export function ExtraImportantSettingsByContextProvider({
    provider,
    description = "",
}: ExtraComponentProps) {
    if (provider instanceof PointsPathFormDataProvider) {
        const { material } = provider;
        const latticeType = new Made.Lattice(material.lattice).typeExtended;
        const imgSrc = `/images/brillouin_zone/${latticeType.toLowerCase().replace("_", "-")}.png`;
        return (
            <BrillouinZoneImage
                latticeType={material.Lattice.type}
                imgSrc={imgSrc}
                description={description}
            />
        );
    }

    return null;
}
