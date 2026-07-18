import { jsx as _jsx } from "react/jsx-runtime";
import Checkbox from "@mat3ra/cove/dist/mui/components/checkbox/Checkbox";
import Grid from "@mui/material/Grid";
export function DataFrameIOUnitResultCheckbox({ id, label, checked, disabled, onChange, }) {
    const CheckboxAny = Checkbox;
    return (_jsx(Grid, { item: true, xs: 6, md: 4, lg: 3, children: _jsx(CheckboxAny, { className: "result-checkbox", id: id, value: id, label: label, checked: checked, disabled: disabled, onChange: onChange }) }));
}
