import React from "react";
export type DataFrameIOUnitResultCheckboxProps = {
    id: string;
    label: string;
    checked: boolean;
    disabled: boolean;
    onChange: (checked: boolean) => void;
};
export declare function DataFrameIOUnitResultCheckbox({ id, label, checked, disabled, onChange, }: DataFrameIOUnitResultCheckboxProps): React.JSX.Element;
