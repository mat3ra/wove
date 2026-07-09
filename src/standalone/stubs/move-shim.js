import React from "react";

/**
 * Minimal @mat3ra/move shim for the wove standalone dev server.
 *
 * The full @mat3ra/move barrel pulls in PseudoForm, PseudoList,
 * PseudoUploadDialog which transitively need @mat3ra/prode and cove.js
 * subpaths that aren't available in the wove standalone environment.
 *
 * This shim provides stub components for the two exports wove actually uses:
 * BrillouinZoneImage (context/utils.tsx) and Model (OverviewAccordion.tsx).
 */
export const BrillouinZoneImage = () => null;
export const Model = () => null;

export default { BrillouinZoneImage, Model };
