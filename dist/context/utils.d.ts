import { PointsPathFormDataProvider } from "@mat3ra/wode";
import React, { type ComponentType } from "react";
type BrillouinZoneImageProps = {
    latticeType?: string;
    imgSrc?: string;
    description?: string;
};
interface ExtraComponentProps {
    provider: PointsPathFormDataProvider<any> | unknown;
    description?: string;
    /** Injected by the host app (e.g. @mat3ra/move's BrillouinZoneImage). Defaults to a plain <img>. */
    BrillouinZoneImageComponent?: ComponentType<BrillouinZoneImageProps>;
}
export declare function ExtraImportantSettingsByContextProvider({ provider, description, BrillouinZoneImageComponent, }: ExtraComponentProps): React.JSX.Element | null;
export {};
