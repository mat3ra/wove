import React, { type ComponentType } from "react";
type BrillouinZoneImageProps = {
    latticeType?: string;
    imgSrc?: string;
    description?: string;
};
declare const POINTS_PATH_PROVIDER_NAMES: readonly ["kpath", "qpath", "explicitKPath"];
type PointsPathLikeProvider = {
    name: (typeof POINTS_PATH_PROVIDER_NAMES)[number];
    material: any;
};
interface ExtraComponentProps {
    provider: PointsPathLikeProvider | unknown;
    description?: string;
    /** Injected by the host app (e.g. @mat3ra/move's BrillouinZoneImage). Defaults to a plain <img>. */
    BrillouinZoneImageComponent?: ComponentType<BrillouinZoneImageProps>;
}
export declare function ExtraImportantSettingsByContextProvider({ provider, description, BrillouinZoneImageComponent, }: ExtraComponentProps): React.JSX.Element | null;
export {};
