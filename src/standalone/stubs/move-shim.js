/**
 * Minimal @mat3ra/move shim for the wove standalone dev server.
 *
 * The full @mat3ra/move barrel (dist/exports.js) pulls in PseudoForm,
 * PseudoList, PseudoUploadDialog which transitively need @mat3ra/prode and
 * cove.js subpaths that don't exist in wove's installed versions.
 *
 * This shim re-exports ONLY what wove's source files actually import from
 * @mat3ra/move: BrillouinZoneImage (context/utils.tsx) and Model
 * (OverviewAccordion.tsx).
 */
export { default as BrillouinZoneImage } from "../../../../move/dist/components/BrillouinZoneImage.js";
export { default as Model } from "../../../../move/dist/components/Model.js";
