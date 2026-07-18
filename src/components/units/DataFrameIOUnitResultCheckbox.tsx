import Checkbox from "@mat3ra/cove/dist/mui/components/checkbox/Checkbox";
import Grid from "@mui/material/Grid";
import React from "react";

export type DataFrameIOUnitResultCheckboxProps = {
    id: string;
    label: string;
    checked: boolean;
    disabled: boolean;
    onChange: (checked: boolean) => void;
};

export function DataFrameIOUnitResultCheckbox({
    id,
    label,
    checked,
    disabled,
    onChange,
}: DataFrameIOUnitResultCheckboxProps) {
    const CheckboxAny = Checkbox as any;
    return (
        <Grid item xs={6} md={4} lg={3}>
            <CheckboxAny
                className="result-checkbox"
                id={id}
                value={id}
                label={label}
                checked={checked}
                disabled={disabled}
                onChange={onChange}
            />
        </Grid>
    );
}
