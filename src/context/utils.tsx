import { Made } from "@mat3ra/made";
import React, { type ComponentType } from "react";

// ---------------------------------------------------------------------------
// Injection point.
//
// The rich Brillouin-zone renderer lives in @mat3ra/move (<BrillouinZoneImage>),
// whose barrel pulls heavy transitive deps (rjsf, simpl-schema). wove does NOT
// depend on it directly — the host app passes it in via BrillouinZoneImageComponent,
// and wove falls back to the plain <img> package-native default below.
// ---------------------------------------------------------------------------

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

const POINTS_PATH_PROVIDER_NAMES = ["kpath", "qpath", "explicitKPath"] as const;

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

// Use the provider's schema `name`, not `instanceof`: job/workflow units are built via
// Meteor-compiled `@mat3ra/wode` (see `rspack.config.js` `compileWithMeteor`); wove UI may
// resolve another copy of the same class, so `instanceof PointsPathFormDataProvider` is false
// even for a real kpath/qpath/explicitKPath provider (mirrors `isExecutionUnit` in
// workflow-designer's `ImportantSettings.tsx`, which hit the same issue for `ExecutionUnit`).
function isPointsPathProvider(provider: unknown): provider is PointsPathLikeProvider {
    return (
        typeof provider === "object" &&
        provider !== null &&
        POINTS_PATH_PROVIDER_NAMES.includes((provider as { name?: string }).name as any)
    );
}

/**
 * Zone geometry for a material, from its own reciprocal lattice.
 *
 * Feature-detected rather than imported directly: `ReciprocalLattice.brillouinZone` arrives in
 * made 2026.8+, and wove still has to build against older pins. Returns null there, leaving
 * `imgSrc` as the only option.
 */
function getBrillouinZoneFacesFromMaterial(material: {
    lattice: ConstructorParameters<typeof Made.Lattice>[0];
}): BrillouinZoneFaceLike[] | null {
    const { ReciprocalLattice } = Made as unknown as { ReciprocalLattice?: any };
    if (!ReciprocalLattice) return null;
    try {
        return new ReciprocalLattice(material.lattice).brillouinZone ?? null;
    } catch {
        return null;
    }
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
export function getBrillouinZoneImagePropsFromMaterial(material: {
    lattice: ConstructorParameters<typeof Made.Lattice>[0];
}): Pick<BrillouinZoneImageProps, "latticeType" | "imgSrc" | "faces"> {
    const lattice = new Made.Lattice(material.lattice);
    const latticeTypeExtended = lattice.typeExtended;
    return {
        latticeType: lattice.type,
        // Legacy: web-app-only asset; see JSDoc above.
        imgSrc: `/images/brillouin_zone/${latticeTypeExtended.toLowerCase().replace("_", "-")}.png`,
        faces: getBrillouinZoneFacesFromMaterial(material),
    };
}

export function ExtraImportantSettingsByContextProvider({
    provider,
    description = "",
    BrillouinZoneImageComponent = DefaultBrillouinZoneImage,
}: ExtraComponentProps) {
    if (isPointsPathProvider(provider)) {
        const { latticeType, imgSrc, faces } = getBrillouinZoneImagePropsFromMaterial(
            provider.material,
        );
        return (
            <BrillouinZoneImageComponent
                latticeType={latticeType}
                imgSrc={imgSrc}
                description={description}
                faces={faces}
            />
        );
    }

    return null;
}
