import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import Checkbox from "@mat3ra/cove/dist/mui/components/checkbox/Checkbox";
const CheckboxComponent = Checkbox;
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";
import _ from "underscore";
import s from "underscore.string";
import InfoPopover from "@mat3ra/cove/dist/mui/components/popover/info-popover/InfoPopover";
export function Properties({ subworkflow, onUpdate, editable = true }) {
    const onIsDraftChange = useCallback((bool) => {
        subworkflow.setIsDraft(bool);
        onUpdate(subworkflow.toJSON());
    }, [subworkflow, onUpdate]);
    const properties = subworkflow.properties.map((property, index) => (_jsx(Chip, { label: property, sx: { fontSize: "12px", m: 0.5 } }, s.slugify(`${property}${index}`))));
    if (_.isEmpty(properties))
        return null;
    return (_jsxs(Stack, { spacing: 1, children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "subtitle2", color: "text.primary", children: "Properties" }), _jsxs(InfoPopover, { title: "Subworkflow Properties", children: ["Resulting properties will not be available in \"Analytics\" when ", _jsx("b", { children: "draft" }), " is checked. Use this while prototyping a new workflow with low-fidelity runs."] })] }), _jsx(Box, { children: properties }), _jsx(CheckboxComponent, { label: "Draft", value: subworkflow.isDraft, onChange: (checked) => {
                    onIsDraftChange(checked);
                }, checked: subworkflow.isDraft, disabled: !editable, sx: { pl: 1 }, slotProps: {
                    typography: {
                        pl: 0,
                        variant: "caption",
                        color: "text.primary",
                    },
                } })] }));
}
