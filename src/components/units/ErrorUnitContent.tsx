import JSONViewer from "@mat3ra/cove.js/dist/other/object-viewer/json-viewer";
import { ErrorUnit } from "@mat3ra/wode";
import Box from "@mui/material/Box";
import React from "react";

type Props = {
    unit: ErrorUnit;
};

function parseReasonForViewer(reason: string): object {
    try {
        const parsed: unknown = JSON.parse(reason);
        if (parsed !== null && typeof parsed === "object") {
            return parsed as object;
        }
        return { reason: parsed };
    } catch {
        return { reason };
    }
}

const onViewerUpdate = () => {
    // Read-only viewer; onUpdate required by JSONViewer props.
};

export function ErrorUnitContent({ unit }: Props) {
    const JSONViewerAny = JSONViewer as any;
    return (
        <Box className="ErrorUnitContent" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
                className="json-viewer-content"
                sx={{ maxHeight: 400, overflow: "auto", borderRadius: 1 }}>
                <JSONViewerAny
                    name="reason"
                    src={parseReasonForViewer((unit as any).reason)}
                    collapsed={false}
                    onUpdate={onViewerUpdate}
                />
            </Box>
        </Box>
    );
}
