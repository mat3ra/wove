import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import type { Subworkflow as WodeSubworkflow } from "@mat3ra/wode";
import React from "react";
export type PropertiesProps = {
    subworkflow: WodeSubworkflow;
    onUpdate: (subworkflow: SubworkflowSchema) => void;
    editable?: boolean;
};
/** `total_energy` → `Total energy`. The raw key stays available as the chip's tooltip. */
export declare function humanizePropertyName(property: string): string;
export declare function Properties({ subworkflow, onUpdate, editable }: PropertiesProps): React.JSX.Element | null;
