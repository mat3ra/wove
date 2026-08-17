import type { AnySubworkflowUnitSchema } from "@mat3ra/wode/dist/js/units/factory";
import React from "react";
export type UnitCardAction = Record<string, unknown>;
export type UnitCardProps = {
    index: number;
    unit: AnySubworkflowUnitSchema;
    actions?: UnitCardAction[];
    isSelected?: boolean;
    isBorder?: boolean;
    onSelect?: (unit: AnySubworkflowUnitSchema) => void;
    animateOnHover?: boolean;
    isCardContentExpanded?: boolean;
    /** Reveal the flowchart ID; see {@link CardHeader}. */
    showDeveloperInfo?: boolean;
    /** Show the run-status badge; off in designers, on in job views. */
    showStatus?: boolean;
};
export declare function UnitCard({ index, unit, actions, isSelected, isBorder, onSelect, animateOnHover, isCardContentExpanded, showDeveloperInfo, showStatus, }: UnitCardProps): React.JSX.Element;
