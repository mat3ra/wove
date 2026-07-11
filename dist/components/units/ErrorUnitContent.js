import { jsx as _jsx } from "react/jsx-runtime";
import JSONViewer from "@exabyte-io/cove.js/dist/other/object-viewer/json-viewer";
import Box from "@mui/material/Box";
function parseReasonForViewer(reason) {
    try {
        const parsed = JSON.parse(reason);
        if (parsed !== null && typeof parsed === "object") {
            return parsed;
        }
        return { reason: parsed };
    }
    catch (_a) {
        return { reason };
    }
}
const onViewerUpdate = () => {
    // Read-only viewer; onUpdate required by JSONViewer props.
};
export function ErrorUnitContent({ unit }) {
    const JSONViewerAny = JSONViewer;
    return (_jsx(Box, { className: "ErrorUnitContent", sx: { display: "flex", flexDirection: "column", gap: 2 }, children: _jsx(Box, { className: "json-viewer-content", sx: { maxHeight: 400, overflow: "auto", borderRadius: 1 }, children: _jsx(JSONViewerAny, { name: "reason", src: parseReasonForViewer(unit.reason), collapsed: false, onUpdate: onViewerUpdate }) }) }));
}
