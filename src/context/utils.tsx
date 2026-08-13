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
 * Resolve lattice type + Brillouin-zone image path from a points-path provider material.
 * Prefer schema `lattice` JSON over Material getters (`Lattice` / `getLattice`) so this works
 * across made API renames and plain material configs.
 *
 * TODO: Do not hardcode web-app public paths here (`/images/brillouin_zone/...`). Own the
 * assets in materials-designer (or another UI package) and inject `imgSrc` / the image
 * component from the host so wove stays path-agnostic.
 */
export function getBrillouinZoneImagePropsFromMaterial(material: {
    lattice: ConstructorParameters<typeof Made.Lattice>[0];
}): Pick<BrillouinZoneImageProps, "latticeType" | "imgSrc"> {
    const lattice = new Made.Lattice(material.lattice);
    const latticeTypeExtended = lattice.typeExtended;
    return {
        latticeType: lattice.type,
        // TODO: replace web-app path; see JSDoc above.
        imgSrc: `/images/brillouin_zone/${latticeTypeExtended.toLowerCase().replace("_", "-")}.png`,
    };
}

export function ExtraImportantSettingsByContextProvider({
    provider,
    description = "",
    BrillouinZoneImageComponent = DefaultBrillouinZoneImage,
}: ExtraComponentProps) {
    if (isPointsPathProvider(provider)) {
        const { latticeType, imgSrc } = getBrillouinZoneImagePropsFromMaterial(provider.material);
        return (
            <BrillouinZoneImageComponent
                latticeType={latticeType}
                imgSrc={imgSrc}
                description={description}
            />
        );
    }

    return null;
}
