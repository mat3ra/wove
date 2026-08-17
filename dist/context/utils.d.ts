import { Made } from "@mat3ra/made";
import React, { type ComponentType } from "react";
/** Shape of a zone face as returned by made's `ReciprocalLattice.brillouinZone`. */
type BrillouinZoneFaceLike = {
    vertices: number[][];
    normal: number[];
};
type BrillouinZoneImageProps = {
    latticeType?: string;
    imgSrc?: string;
    description?: string;
    /**
     * Zone geometry derived from this material's own reciprocal lattice, for components that
     * draw the zone rather than fetch a picture of it. Undefined when the installed `made`
     * predates `ReciprocalLattice.brillouinZone`, in which case `imgSrc` remains the only
     * option.
     */
    faces?: BrillouinZoneFaceLike[] | null;
};
/**
 * Every concrete subclass of wode's `PointsPathFormDataProvider`. All five edit a path through
 * reciprocal space and all five want the zone drawn beside the form; leaving two of them out
 * meant Phonon Dispersions and the GW band-structure workflows showed a path with no picture.
 * Keep in step with `@mat3ra/wode` `context/providers/PointsPath/`.
 */
declare const POINTS_PATH_PROVIDER_NAMES: readonly ["kpath", "qpath", "ipath", "explicitKPath", "explicitKPath2PIBA"];
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
/**
 * Resolve lattice type + Brillouin-zone image path from a points-path provider material.
 * Prefer schema `lattice` JSON over Material getters (`Lattice` / `getLattice`) so this works
 * across made API renames and plain material configs.
 *
 * The `imgSrc` here points at a web-app public path that no package ships, so consumers other
 * than the web app render a broken image, and it cannot resolve under a non-root deployment
 * base either. It is kept only for hosts that do serve those assets; everyone else should draw
 * the zone from the `faces` geometry passed alongside it.
 */
export declare function getBrillouinZoneImagePropsFromMaterial(material: {
    lattice: ConstructorParameters<typeof Made.Lattice>[0];
}): Pick<BrillouinZoneImageProps, "latticeType" | "imgSrc" | "faces">;
export declare function ExtraImportantSettingsByContextProvider({ provider, description, BrillouinZoneImageComponent, }: ExtraComponentProps): React.JSX.Element | null;
export {};
